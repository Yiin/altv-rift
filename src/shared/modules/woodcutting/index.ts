import { TreeType } from "./interfaces";
import { TreeTypes } from "./trees/tree-types";

export function getTreeLevel(type?: TreeType) {
  if (!type || type in TreeTypes === false) {
    return 0;
  }
  return TreeTypes[type].level;
}

export function getTreeName(type?: TreeType) {
  if (!type || type in TreeTypes === false) {
    return "Unknown tree";
  }
  return TreeTypes[type].name;
}

export function getTreeLogs(type?: TreeType) {
  if (!type || type in TreeTypes === false) {
    throw new Error("Invalid tree type.");
  }
  return TreeTypes[type].logs;
}
