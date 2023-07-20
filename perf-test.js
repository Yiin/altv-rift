class MockElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.classList = new Set();
    this.childNodes = [];
    this.attributes = {};
    this.style = {};
  }

  get firstChild() {
    return this.childNodes[0];
  }

  appendChild(child) {
    this.childNodes.push(child);
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child);
    if (index !== -1) {
      this.childNodes.splice(index, 1);
    }
  }

  replaceChild(newChild, oldChild) {
    const index = this.childNodes.indexOf(oldChild);
    if (index !== -1) {
      this.childNodes[index] = newChild;
    }
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  addClass(name) {
    this.classList.add(name);
  }

  removeClass(name) {
    this.classList.delete(name);
  }
}

const mockDocument = {
  createElement(tagName) {
    return new MockElement(tagName);
  },

  createTextNode(text) {
    return { tagName: "#text", data: text };
  },
};

function createRenderer(document = mockDocument) {
  return {
    render(element, root) {
      renderParsedNode(root.firstChild, element, root, document);
    },
  };
}

function createTextNode(document, text) {
  const node = document.createTextNode(text);
  return node;
}

function renderParsedNode(rmlNode, parsedElement, parent, document) {
  if (!rmlNode) {
    if ("text" in parsedElement) {
      rmlNode = createTextNode(document, parsedElement.text);
    } else {
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
      const ref = createTextNode(document, parsedElement.text);
      parent.replaceChild(ref, rmlNode);
      rmlNode = ref;
    } else {
      if (rmlNode.data !== parsedElement.text) {
        const ref = createTextNode(document, parsedElement.text);
        parent.replaceChild(ref, rmlNode);
        rmlNode = ref;
      }
    }
    return;
  } else if (tagNamesDoNotMatch) {
    const ref = document.createElement(parsedElement.tagName);
    applyClassesAndAttrs(ref, parsedElement);
    parent.replaceChild(ref, rmlNode);
    rmlNode = ref;
  } else {
    applyClassesAndAttrs(rmlNode, parsedElement);
  }

  let currentChildren = rmlNode.childNodes;
  const parsedChildren = parsedElement.children;

  if (currentChildren.length !== parsedChildren.length) {
    currentChildren = [];

    for (const child of rmlNode.childNodes) {
      rmlNode.removeChild(child);
    }
  }

  for (let i = 0; i < parsedChildren.length; i++) {
    renderParsedNode(currentChildren[i], parsedChildren[i], rmlNode, document);
  }
}

function parseElement(tagName, selector, props, children) {
  const classNames = [];

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

  const type = tagName || "div";

  const parsedElement = {
    tagName: type,
    classNames,
    props,
    children: [],
  };

  parsedElement.children = children.map((child) => {
    if (typeof child === "object" && child.tagName !== "#text") {
      child.parent = parsedElement;
      return child;
    } else {
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

function createSelector(type) {
  return (...args) => {
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

function applyClassesAndAttrs(node, parsedNode) {
  const nodeClasses = Array.from(node.classList);

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
    if (key === "style") {
      for (const rule in value) {
        if (node.style[rule] !== value[rule]) {
          node.style[rule] = value[rule];
        }
      }
    } else {
      node.setAttribute(key, value);
    }
  }
}

const div = createSelector("div");
const span = createSelector("span");
const table = createSelector("table");
const button = createSelector("button");
const rml = createSelector("rml");
const head = createSelector("head");
const title = createSelector("title");
const link = createSelector("link");
const style = createSelector("style");
const body = createSelector("body");
const br = createSelector("br");
const handle = createSelector("handle");
const img = createSelector("img");
const form = createSelector("form");
const input = createSelector("input");
const textarea = createSelector("textarea");
const select = createSelector("select");
const option = createSelector("option");
const label = createSelector("label");
const tabset = createSelector("tabset");
const tab = createSelector("tab");
const panel = createSelector("panel");
const progress = createSelector("progress");

const renderer = createRenderer();

const root = mockDocument.createElement("div");

for (let i = 0; i < 100_000_000; ++i) {
  div(
    ".nametag-wrapper",
    {
      style: {
        transform: `translate(-50%, -50%) translate(${~~(
          Math.random() * 200
        )}px, ${~~(Math.random() * 200)}px)`,
      },
    },
    [
      div(
        ".nametag",
        {
          style: {
            transform: `scale(${Math.random()})`,
          },
        },
        ["Sophia"]
      ),
    ]
  );
  // renderer.render(element, root);
}
