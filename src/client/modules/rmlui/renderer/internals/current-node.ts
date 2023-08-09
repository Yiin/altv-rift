import alt from "alt-client";

let currentNode: alt.RmlElement | null;

export function setCurrentNode(node: alt.RmlElement | null) {
  currentNode = node;
}

export function getCurrentNode() {
  if (!currentNode) {
    throw new Error("getCurrentNode should only be called inside a render");
  }
  return currentNode;
}
