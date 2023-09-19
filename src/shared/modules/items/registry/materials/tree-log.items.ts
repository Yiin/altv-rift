import { registerItem } from "../../items-registry";
import { makeItemKeys } from "../../lib/make-item-keys";
import { Item, ItemKey } from "../../types";

export const TreeLogs = makeItemKeys<TreeLogItemKey>()({
  HAWTHORN_LOGS: "hawthorn_logs",
  BEECH_LOGS: "beech_logs",
  BLACK_MANGROVE_LOGS: "black_mangrove_logs",
  FRANGIPANI_LOGS: "frangipani_logs",
  PALM_FAN_LOGS: "palm_fan_logs",
  UMBRELLA_LOGS: "umbrella_logs",
  JOSHUA_TREE_LOGS: "joshua_tree_logs",
  PALM_LOGS: "palm_logs",
  ROYAL_PALM_LOGS: "royal_palm_logs",
  OLIVE_LOGS: "olive_logs",
  BIRCH_LOGS: "birch_logs",
  CEDAR_LOGS: "cedar_logs",
  EUCALYPTUS_LOGS: "eucalyptus_logs",
  JACADA_LOGS: "jacada_logs",
  FICUS_LOGS: "ficus_logs",
  MAPLE_LOGS: "maple_logs",
  MESQUITE_LOGS: "mesquite_logs",
  OAK_LOGS: "oak_logs",
  PINE_LOGS: "pine_logs",
});

export type TreeLogItemKey = Brand<string, "TreeLogItemKey">;

export type TreeLogItem = {
  key: TreeLogItemKey;
  amount: number;
};

export type TreeLogItemInfo = {
  key: TreeLogItemKey;
  name: string;
  description: string;
};

export const treeLogs: Record<TreeLogItemKey, TreeLogItemInfo> = {
  hawthorn_logs: {
    key: "hawthorn_logs",
    name: "Hawthorn Logs",
    description: "Logs from a Hawthorn Tree.",
  },
  beech_logs: {
    key: "beech_logs",
    name: "Large Beech Logs",
    description: "Logs from a Beech Tree.",
  },
  black_mangrove_logs: {
    key: "black_mangrove_logs",
    name: "Black Mangrove Logs",
    description: "Logs from a Black Mangrove.",
  },
  frangipani_logs: {
    key: "frangipani_logs",
    name: "Frangipani Logs",
    description: "Logs from a Frangipani.",
  },
  palm_fan_logs: {
    key: "palm_fan_logs",
    name: "Palm Fan Logs",
    description: "Logs from a Palm Fan Tree.",
  },
  umbrella_logs: {
    key: "umbrella_logs",
    name: "Umbrella Logs",
    description: "Logs from an Umbrella Tree.",
  },
  joshua_tree_logs: {
    key: "joshua_tree_logs",
    name: "Joshua Tree Logs",
    description: "Logs from a Joshua Tree.",
  },
  palm_logs: {
    key: "palm_logs",
    name: "Palm Logs",
    description: "Logs from a Palm Tree.",
  },
  royal_palm_logs: {
    key: "royal_palm_logs",
    name: "Royal Palm Logs",
    description: "Logs from a Royal Palm Tree.",
  },
  olive_logs: {
    key: "olive_logs",
    name: "Olive Logs",
    description: "Logs from an Olive tree.",
  },
  birch_logs: {
    key: "birch_logs",
    name: "Birch Logs",
    description: "Logs from a Birch Tree.",
  },
  cedar_logs: {
    key: "cedar_logs",
    name: "Cedar Logs",
    description: "Logs from a Cedar Tree.",
  },
  eucalyptus_logs: {
    key: "eucalyptus_logs",
    name: "Eucalyptus Logs",
    description: "Logs from a Eucalyptus Tree.",
  },
  jacada_logs: {
    key: "jacada_logs",
    name: "Jacada Logs",
    description: "Logs from a Jacada Tree.",
  },
  ficus_logs: {
    key: "ficus_logs",
    name: "Ficus Logs",
    description: "Logs from a Ficus Tree.",
  },
  maple_logs: {
    key: "maple_logs",
    name: "Maple Logs",
    description: "Logs from a Maple Tree.",
  },
  mesquite_logs: {
    key: "mesquite_logs",
    name: "Mesquite Logs",
    description: "Logs from a Mesquite Tree.",
  },
  oak_logs: {
    key: "oak_logs",
    name: "Oak Logs",
    description: "Logs from an Oak Tree.",
  },
  pine_logs: {
    key: "pine_logs",
    name: "Pine Logs",
    description: "Logs from a Pine Tree.",
  },
} as Record<TreeLogItemKey, TreeLogItemInfo>;

/**
 * Register all tree logs.
 */
for (const [key, info] of Object.entries(treeLogs)) {
  registerItem(key as TreeLogItemKey, info);
}

export function isItemKeyTreeLog(key: ItemKey): key is TreeLogItemKey {
  return key in treeLogs;
}

export function isItemTreeLog(item: Item): item is TreeLogItem {
  return isItemKeyTreeLog(item.key);
}
