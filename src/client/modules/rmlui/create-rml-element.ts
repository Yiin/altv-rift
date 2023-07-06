import alt from "alt-client";

declare global {
  namespace JSX {
    interface Element {
      [key: string]: any;
    }
    interface IntrinsicElementAttributes {
      [key: string]: any;
    }
  }
  interface HTMLAttributes {
    [key: string]: any;
  }
}

const DocumentContext = {
  current: null as alt.RmlDocument | null,
};

export function createElement(
  tagName: string,
  props: any = {},
  ...children: any[]
) {
  if (DocumentContext.current === null) {
    throw new Error("No RmlDocument is set in DocumentContext.");
  }
  const element = DocumentContext.current.createElement(tagName);

  for (const [key, value] of Object.entries<any>(props)) {
    if (key.startsWith("on")) {
      const eventName = key.slice(2).toLowerCase();
      element.on(eventName, value);
      continue;
    }
    element.setAttribute(key, value);
  }

  element.innerRML = children.join("");

  return element;
}

export function createRmlElement(
  document: alt.RmlDocument,
  jsx: () => JSX.Element
) {
  DocumentContext.current = document;
  return jsx();
}
