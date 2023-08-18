import { TreeType } from "./interfaces";
import { TreeLevels, TreeXPPerLog } from "./tree-levels";
import { TreeTypes } from "./tree-types";

export function getTreeLevel(type?: TreeType) {
  if (!type || type in TreeTypes === false) {
    return 1;
  }
  return TreeLevels[type];
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

export function getTreeLogXp(type?: TreeType) {
  if (!type || type in TreeTypes === false) {
    throw new Error("Invalid tree type.");
  }
  return TreeXPPerLog[getTreeLevel(type)];
}
