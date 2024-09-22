import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const TreeLogs = makeKeys<TreeLogItemKey>()({
  COMMON_TREE_LOGS: "common_tree_logs",
  UNCOMMON_TREE_LOGS: "uncommon_tree_logs",
  RARE_TREE_LOGS: "rare_tree_logs",
  EPIC_TREE_LOGS: "epic_tree_logs",
  LEGENDARY_TREE_LOGS: "legendary_tree_logs",
});

export type TreeLogItemKey = Brand<string, "TreeLogItemKey">;

export type TreeLogItem = {
  key: TreeLogItemKey;
  amount: number;
  grade: ItemGrade; // hardcoded in create-item.ts to match the item key
};

export type TreeLogItemInfo = {
  key: TreeLogItemKey;
  name: string;
  description: string;
};

export const treeLogs = registerItems<TreeLogItemInfo>([
  {
    key: TreeLogs.COMMON_TREE_LOGS,
    name: "Common Tree Logs",
    description: "Logs from a Common Tree.",
  },
  {
    key: TreeLogs.UNCOMMON_TREE_LOGS,
    name: "Uncommon Tree Logs",
    description: "Logs from an Uncommon Tree.",
  },
  {
    key: TreeLogs.RARE_TREE_LOGS,
    name: "Rare Tree Logs",
    description: "Logs from a Rare Tree.",
  },
  {
    key: TreeLogs.EPIC_TREE_LOGS,
    name: "Epic Tree Logs",
    description: "Logs from an Epic Tree.",
  },
  {
    key: TreeLogs.LEGENDARY_TREE_LOGS,
    name: "Legendary Tree Logs",
    description: "Logs from a Legendary Tree.",
  },
]);

export function isItemKeyTreeLog(key: string): key is TreeLogItemKey {
  return treeLogs.has(key as TreeLogItemKey);
}

export function isItemTreeLog(item: Item): item is TreeLogItem {
  return isItemKeyTreeLog(item.key);
}

export function getTreeLogByGrade(grade: ItemGrade): TreeLogItemKey {
  switch (grade) {
    case ItemGrade.COMMON:
      return TreeLogs.COMMON_TREE_LOGS;
    case ItemGrade.UNCOMMON:
      return TreeLogs.UNCOMMON_TREE_LOGS;
    case ItemGrade.RARE:
      return TreeLogs.RARE_TREE_LOGS;
    case ItemGrade.EPIC:
      return TreeLogs.EPIC_TREE_LOGS;
    case ItemGrade.LEGENDARY:
      return TreeLogs.LEGENDARY_TREE_LOGS;
  }

  throw new Error(`Invalid tree log grade: ${grade}`);
}