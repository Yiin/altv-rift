import { ItemGrade } from "../items";
import { type TreeType } from "./interfaces";
import { TreeGrades, TreeXPPerLog } from "./tree-levels";
import { TreeTypes } from "./tree-types";

const GRADE_TO_LEVEL = {
  [ItemGrade.COMMON]: 1,
  [ItemGrade.UNCOMMON]: 20,
  [ItemGrade.RARE]: 40,
  [ItemGrade.EPIC]: 60,
  [ItemGrade.LEGENDARY]: 80,
} as const;

export function getTreeGrade(type?: TreeType): ItemGrade {
  if (!type || type in TreeTypes === false) {
    return ItemGrade.COMMON;
  }
  return TreeGrades[type];
}

export function getTreeLevel(type?: TreeType): number {
  if (!type || type in TreeTypes === false) {
    return 1;
  }
  const grade = TreeGrades[type];
  return GRADE_TO_LEVEL[grade];
}

export function getTreeName(type?: TreeType): string {
  if (!type || type in TreeTypes === false) {
    return "Unknown tree";
  }
  return TreeTypes[type].name;
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
