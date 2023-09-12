import * as alt from "@altv/client";

let tree: alt.VirtualEntity | null = null;

export function setChoppingTree(entity: alt.VirtualEntity | null) {
  tree = entity;
}

export function getChoppingTree() {
  if (!tree) {
    throw new Error("No tree is being chopped.");
  }
  return tree;
}

export function haveTreeToChop() {
  return tree !== null;
}
