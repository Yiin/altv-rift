import { TreeLogItemKey } from "../items";
import { TreeType } from "./interfaces";
import { TreeLevels, TreeXPPerLog } from "./tree-levels";
import { TreeTypes } from "./tree-types";

export function getTreeLevel(type?: TreeType): number {
  if (!type || type in TreeTypes === false) {
    return 1;
  }
  return TreeLevels[type];
}

export function getTreeName(type?: TreeType): string {
  if (!type || type in TreeTypes === false) {
    return "Unknown tree";
  }
  return TreeTypes[type].name;
}

export function getTreeLogs(type?: TreeType): TreeLogItemKey {
  if (!type || type in TreeTypes === false) {
    throw new Error("Invalid tree type.");
  }
  return TreeTypes[type].logs;
}

export function getTreeLogXp(type?: TreeType): number {
  if (!type || type in TreeTypes === false) {
    throw new Error("Invalid tree type.");
  }
  const treeLevel = getTreeLevel(type);
  const treeXpPerLog = Object.entries(TreeXPPerLog);

  for (let i = 0; i < treeXpPerLog.length - 1; i++) {
    const [level, xp] = treeXpPerLog[i];
    const nextLevel = +treeXpPerLog[i + 1][0];
    if (treeLevel >= +level && treeLevel <= nextLevel) {
      return xp;
    }
  }
  return 0;
}
