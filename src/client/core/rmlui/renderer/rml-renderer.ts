import alt from "@altv/client";
import { AnchorEntityMap } from "./anchors";
import { EveryFrameHook, ParsedElement, ParsedNode } from "./types";
import { getCurrentNode } from "./internals/current-node";

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
  node.meta.text = text;
  return node;
}

function renderParsedNode(
  rmlNode: alt.RmlElement | undefined,
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
      const ref = createTextNode(document, parsedElement.text);
      parent.replaceChild(ref, rmlNode);
      rmlNode.destroy();
      rmlNode = ref;
    } else {
      // Update text node
      if (rmlNode.meta.text !== parsedElement.text) {
        const ref = createTextNode(document, parsedElement.text);
        rmlNode.parent?.replaceChild(ref, rmlNode);
        rmlNode.destroy();
        rmlNode = ref;
      }
    }
    return;
  } else if (tagNamesDoNotMatch) {
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

  // if (currentChildren.length !== parsedChildren.length) {
  //   // If the number of children has changed, we need to re-render the whole thing
  //   currentChildren = [];

  //   for (const child of rmlNode.childNodes) {
  //     rmlNode.removeChild(child);
  //     child.destroy();
  //   }
  // }

  // Diff children
  for (let i = 0; i < parsedChildren.length; i++) {
    if (
      typeof parsedChildren[i] === "object" &&
      parsedChildren[i] &&
      Symbol.for("EVERY_FRAME") in parsedChildren[i]
    ) {
      const child = parsedChildren[i] as EveryFrameHook;
      getCurrentNode().hooks.push((...args) => {
        if (!rmlNode) {
          return;
        }

        const result = child.compute(...args);
        if (!result) {
          rmlNode.removeChild(currentChildren[i]);
          currentChildren[i].destroy();
        } else {
          renderParsedNode(
            rmlNode.childNodes[i],
            parseChild(result, parsedElement),
            rmlNode,
            document
          );
        }
      });
    } else {
      renderParsedNode(currentChildren[i], parsedChildren[i] as ParsedElement, rmlNode, document);
    }
  }
}

interface ElementProps {
  className?: string | any[];
  [key: string]: any;
}

function parseElement(
  tagName: string,
  props: ElementProps,
  children: (string | ParsedElement)[]
): ParsedElement {
  const classNames: string[] =
    typeof props.className === "string"
      ? [props.className]
      : Array.isArray(props.className)
        ? props.className.filter(Boolean)
        : [];

  delete props.className;

  const type = tagName || "div";

  const parsedElement: ParsedElement = {
    tagName: type,
    classNames,
    props,
    children: [],
  };

  parsedElement.children = children.map((child) => {
    return parseChild(child, parsedElement);
  });

  return parsedElement;
}

function parseChild(child: string | ParsedElement, parsedElement: ParsedNode) {
  // if component
  if (typeof child === "object" && !("text" in child)) {
    child.parent = parsedElement;
    return child;
  } else {
    // if primitive
    return {
      parent: parsedElement,
      text: child && typeof child === "object" ? JSON.stringify(child) : child.toString(),
    };
  }
}

export function createSelector(type: string) {
  return (...args: [ElementProps, any[]] | [ElementProps] | [any[]]) => {
    let props = {},
      children = [];
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (Array.isArray(arg)) {
        children = arg.filter(Boolean);
      } else if (typeof arg === "object") {
        props = arg;
      }
    }
    return parseElement(type, props, children);
  };
}

function applyClassesAndAttrs(node: alt.RmlElement, parsedNode: ParsedNode) {
  const nodeClasses = node.classList;

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

  for (const attr in node.attributes) {
    if (!(attr in parsedNode.props)) {
      node.removeAttribute(attr);
    }
  }

  for (const key in parsedNode.props) {
    const value = parsedNode.props[key];
    if (key.startsWith("on")) {
      // const eventName = key.slice(2);
      // const listeners = node.listeners[eventName];
      // if (!listeners.includes(value)) {
      //   listeners.forEach((listener) => node.off(eventName, listener));
      //   node.on(eventName, value);
      // }
    } else if (key === "style") {
      for (const rule in value) {
        if (
          typeof value[rule] === "object" &&
          value[rule] &&
          Symbol.for("EVERY_FRAME") in value[rule]
        ) {
          getCurrentNode().hooks.push((...args: any[]) => {
            node.style[rule] = value[rule].compute(...args);
          });
        } else if (node.style[rule] !== value[rule]) {
          node.style[rule] = value[rule];
        }
      }
    } else {
      node.setAttribute(key, value as string);
    }
  }
}
