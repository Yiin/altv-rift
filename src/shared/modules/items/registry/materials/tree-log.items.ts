import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item, ItemKey } from "../../types";

export const TreeLogs = makeKeys<TreeLogItemKey>()({
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

export const treeLogs = registerItems<TreeLogItemInfo>([
  {
    key: TreeLogs.HAWTHORN_LOGS,
    name: "Hawthorn Logs",
    description: "Logs from a Hawthorn Tree.",
  },
  {
    key: TreeLogs.BEECH_LOGS,
    name: "Large Beech Logs",
    description: "Logs from a Beech Tree.",
  },
  {
    key: TreeLogs.BLACK_MANGROVE_LOGS,
    name: "Black Mangrove Logs",
    description: "Logs from a Black Mangrove.",
  },
  {
    key: TreeLogs.FRANGIPANI_LOGS,
    name: "Frangipani Logs",
    description: "Logs from a Frangipani.",
  },
  {
    key: TreeLogs.PALM_FAN_LOGS,
    name: "Palm Fan Logs",
    description: "Logs from a Palm Fan Tree.",
  },
  {
    key: TreeLogs.UMBRELLA_LOGS,
    name: "Umbrella Logs",
    description: "Logs from an Umbrella Tree.",
  },
  {
    key: TreeLogs.JOSHUA_TREE_LOGS,
    name: "Joshua Tree Logs",
    description: "Logs from a Joshua Tree.",
  },
  {
    key: TreeLogs.PALM_LOGS,
    name: "Palm Logs",
    description: "Logs from a Palm Tree.",
  },
  {
    key: TreeLogs.ROYAL_PALM_LOGS,
    name: "Royal Palm Logs",
    description: "Logs from a Royal Palm Tree.",
  },
  {
    key: TreeLogs.OLIVE_LOGS,
    name: "Olive Logs",
    description: "Logs from an Olive tree.",
  },
  {
    key: TreeLogs.BIRCH_LOGS,
    name: "Birch Logs",
    description: "Logs from a Birch Tree.",
  },
  {
    key: TreeLogs.CEDAR_LOGS,
    name: "Cedar Logs",
    description: "Logs from a Cedar Tree.",
  },
  {
    key: TreeLogs.EUCALYPTUS_LOGS,
    name: "Eucalyptus Logs",
    description: "Logs from a Eucalyptus Tree.",
  },
  {
    key: TreeLogs.JACADA_LOGS,
    name: "Jacada Logs",
    description: "Logs from a Jacada Tree.",
  },
  {
    key: TreeLogs.FICUS_LOGS,
    name: "Ficus Logs",
    description: "Logs from a Ficus Tree.",
  },
  {
    key: TreeLogs.MAPLE_LOGS,
    name: "Maple Logs",
    description: "Logs from a Maple Tree.",
  },
  {
    key: TreeLogs.MESQUITE_LOGS,
    name: "Mesquite Logs",
    description: "Logs from a Mesquite Tree.",
  },
  {
    key: TreeLogs.OAK_LOGS,
    name: "Oak Logs",
    description: "Logs from an Oak Tree.",
  },
  {
    key: TreeLogs.PINE_LOGS,
    name: "Pine Logs",
    description: "Logs from a Pine Tree.",
  },
]);

export function isItemKeyTreeLog(key: string): key is TreeLogItemKey {
  return treeLogs.has(key as TreeLogItemKey);
}

export function isItemTreeLog(item: Item): item is TreeLogItem {
  return isItemKeyTreeLog(item.key);
}
