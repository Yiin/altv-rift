import { ItemGrade, TreeLogs } from "../items";
import { TreeGrades } from "./tree-grades";
import { TreeTypes, type TreeType } from "./tree-types";

type ValidTreeGrades = typeof TreeGrades[keyof typeof TreeGrades];

const GRADE_TO_LEVEL: Record<ValidTreeGrades, number> = {
  [ItemGrade.COMMON]: 1,
  [ItemGrade.UNCOMMON]: 20,
  [ItemGrade.RARE]: 40,
  [ItemGrade.EPIC]: 60,
  [ItemGrade.LEGENDARY]: 80,
};

export function getTreeGrade(type?: TreeType): ValidTreeGrades {
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
  const treeGrade = getTreeGrade(type);

  return ({
    [ItemGrade.COMMON]: 11,
    [ItemGrade.UNCOMMON]: 33,
    [ItemGrade.RARE]: 63,
    [ItemGrade.EPIC]: 97,
    [ItemGrade.LEGENDARY]: 136,
  })[treeGrade] ?? 0;
}

export function getTreeLog(treeType?: keyof typeof TreeTypes) {
  if (!treeType) {
    return TreeLogs.COMMON_TREE_LOGS;
  }

  return {
    [ItemGrade.COMMON]: TreeLogs.COMMON_TREE_LOGS,
    [ItemGrade.UNCOMMON]: TreeLogs.UNCOMMON_TREE_LOGS,
    [ItemGrade.RARE]: TreeLogs.RARE_TREE_LOGS,
    [ItemGrade.EPIC]: TreeLogs.EPIC_TREE_LOGS,
    [ItemGrade.LEGENDARY]: TreeLogs.LEGENDARY_TREE_LOGS,
  }[TreeGrades[treeType]];
}
