export const isNodeFocusable = (el: Node): el is HTMLElement =>
  el instanceof HTMLElement &&
  el.tabIndex !== -1 &&
  (["A", "INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(el.tagName) ||
    el.isContentEditable ||
    el.getAttribute("role")?.startsWith("button") ||
    el.getAttribute("aria-hidden") !== "true");
