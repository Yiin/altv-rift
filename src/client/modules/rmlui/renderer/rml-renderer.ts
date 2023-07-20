import alt from "alt-client";
import { AnchorEntityMap } from "./anchors";
import { ParsedElement, ParsedNode } from "./types";

// We use a map to simplify the mapping of entity and RmlElement
export const elements: Map<
  AnchorEntityMap[keyof AnchorEntityMap],
  Map<string, alt.RmlElement>
> = new Map();

export function createRenderer(document: alt.RmlDocument) {
  return {
    render(element: ParsedElement, root: alt.RmlElement) {
      renderParsedNode(root.firstChild, element, root, document);
    },
  };
}

function createTextNode(document: alt.RmlDocument, text: string) {
  const node = document.createTextNode(text);
  node.setMeta("text", text);
  return node;
}

function renderParsedNode(
  rmlNode: alt.RmlElement | null,
  parsedElement: ParsedElement,
  parent: alt.RmlElement,
  document: alt.RmlDocument
) {
  // Initial render or previous render didn't rendered anything
  if (!rmlNode) {
    if ("text" in parsedElement) {
      rmlNode = createTextNode(document, parsedElement.text);
    } else {
      // Create new element
      rmlNode = document.createElement(parsedElement.tagName);

      applyClassesAndAttrs(rmlNode, parsedElement);
    }

    parent.appendChild(rmlNode);
  }

  const parsedElementIsText = "text" in parsedElement;
  const tagNamesDoNotMatch =
    "tagName" in parsedElement &&
    rmlNode.tagName.toLowerCase() !== parsedElement.tagName.toLowerCase();

  if (parsedElementIsText) {
    if (rmlNode.tagName !== "#text") {
      // Replace element with text node
      alt.log("Replace element with text node");
      const ref = createTextNode(document, parsedElement.text);
      parent.replaceChild(ref, rmlNode);
      rmlNode.destroy();
      rmlNode = ref;
    } else {
      // Update text node
      if (rmlNode.getMeta("text") !== parsedElement.text) {
        alt.log("Update text node");
        const ref = createTextNode(document, parsedElement.text);
        rmlNode.parent?.replaceChild(ref, rmlNode);
        rmlNode.destroy();
        rmlNode = ref;
      }
    }
    return;
  } else if (tagNamesDoNotMatch) {
    alt.log("Tag names do not match");
    // Replace element with new element
    const ref = document.createElement(parsedElement.tagName);

    applyClassesAndAttrs(ref, parsedElement);

    parent.replaceChild(ref, rmlNode);
    rmlNode.destroy();
    rmlNode = ref;
  } else {
    applyClassesAndAttrs(rmlNode, parsedElement);
  }

  let currentChildren = rmlNode.childNodes;
  const parsedChildren = parsedElement.children;

  if (currentChildren.length !== parsedChildren.length) {
    alt.log("Children length does not match");
    // If the number of children has changed, we need to re-render the whole thing
    currentChildren = [];

    for (const child of rmlNode.childNodes) {
      rmlNode.removeChild(child);
      child.destroy();
    }
  }

  // Diff children
  for (let i = 0; i < parsedChildren.length; i++) {
    renderParsedNode(currentChildren[i], parsedChildren[i], rmlNode, document);
  }
}

function parseElement(
  tagName: string,
  selector: string,
  props: Record<string, any>,
  children: (string | ParsedElement)[]
): ParsedElement {
  const classNames: string[] = [];

  if (selector) {
    let start = 0;
    let i = 0;
    while (i < selector.length) {
      if (selector[i] === "." || selector[i] === "#") {
        if (i > start) {
          const value = selector.slice(start + 1, i);
          if (selector[start] === ".") {
            classNames.push(value);
          } else {
            props.id = value;
          }
        }
        start = i;
      }
      i++;
    }
    if (i > start) {
      const value = selector.slice(start + 1, i);
      if (selector[start] === ".") {
        classNames.push(value);
      } else if (selector[start] === "#") {
        props.id = value;
      }
    }
  }

  // Split attributes data into individual attributes

  const type = tagName || "div"; // if no tag name is provided, default to "div"

  const parsedElement: ParsedElement = {
    tagName: type,
    classNames,
    props,
    children: [],
  };

  parsedElement.children = children.map((child) => {
    // if component
    if (typeof child === "object" && !("text" in child)) {
      child.parent = parsedElement;
      return child;
    } else {
      // if primitive
      return {
        parent: parsedElement,
        text:
          child && typeof child === "object"
            ? JSON.stringify(child)
            : child.toString(),
      };
    }
  });

  return parsedElement;
}

export function createSelector(type: string) {
  return (
    ...args:
      | [string, Record<string, any>, any[]]
      | [string]
      | [string, Record<string, any>]
      | [string, any[]]
      | [Record<string, any>, any[]]
      | [Record<string, any>]
      | [any[]]
  ) => {
    let selector = "",
      props = {},
      children = [];
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (Array.isArray(arg)) {
        children = arg;
      } else if (typeof arg === "object") {
        props = arg;
      } else {
        selector = arg;
      }
    }
    return parseElement(type, selector, props, children);
  };
}

function applyClassesAndAttrs(node: alt.RmlElement, parsedNode: ParsedNode) {
  const nodeClasses = node.getClassList();

  nodeClasses.forEach((className) => {
    if (!parsedNode.classNames.includes(className)) {
      node.removeClass(className);
    }
  });

  parsedNode.classNames.forEach((className) => {
    if (!nodeClasses.includes(className)) {
      node.addClass(className);
    }
  });

  for (const attr in node.getAttributes()) {
    if (!(attr in parsedNode.props)) {
      node.removeAttribute(attr);
    }
  }

  for (const key in parsedNode.props) {
    const value = parsedNode.props[key];
    if (key.startsWith("on")) {
      const eventName = key.slice(2);
      const listeners = node.getEventListeners(eventName);
      if (!listeners.includes(value)) {
        listeners.forEach((listener) => node.off(eventName, listener));
        node.on(eventName, value);
      }
    } else if (key === "style") {
      for (const rule in value) {
        if (node.style[rule] !== value[rule]) {
          node.style[rule] = value[rule];
        }
      }
    } else {
      node.setAttribute(key, value as string);
    }
  }
}
