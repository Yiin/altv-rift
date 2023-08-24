import { ItemType } from "@prisma/client";
import { ItemKey } from "../types";

export const TreeLogs = {
  HAWTHORN_LOGS: "hawthorn_logs",
  BEECH_LOGS: "beech_logs",
  BLACK_MANGROVE_LOGS: "black_mangrove_logs",
  FRANGIPANI_LOGS: "frangipani_logs",
  PALM_FAN_LOGS: "palm_fan_logs",
  UMBRELLA_LOGS: "umbrella_logs",
  JOSHUA_TREE_LOGS: "joshua_tree_logs",
  PALM_LOGS: "palm_logs",
  ROYAL_PALM_LOGS: "royal_palm_logs",
  RUSSIAN_OLIVE_LOGS: "russian_olive_logs",
  BIRCH_LOGS: "birch_logs",
  CEDAR_LOGS: "cedar_logs",
  EUCALYPTUS_LOGS: "eucalyptus_logs",
  JACADA_LOGS: "jacada_logs",
  FICUS_LOGS: "ficus_logs",
  MAPLE_LOGS: "maple_logs",
  MESQUITE_LOGS: "mesquite_logs",
  OAK_LOGS: "oak_logs",
  PINE_LOGS: "pine_logs",
} as const;

export type TreeLogItemKey = (typeof TreeLogs)[keyof typeof TreeLogs];

export type TreeLogItemInfo = {
  key: TreeLogItemKey;
  itemType: typeof ItemType.MATERIAL;
  name: string;
  description: string;
};

export const treeLogs: Record<TreeLogItemKey, TreeLogItemInfo> = {
  hawthorn_logs: {
    key: "hawthorn_logs",
    itemType: ItemType.MATERIAL,
    name: "Hawthorn Logs",
    description: "Logs from a Hawthorn Tree.",
  },
  beech_logs: {
    key: "beech_logs",
    itemType: ItemType.MATERIAL,
    name: "Large Beech Logs",
    description: "Logs from a Beech Tree.",
  },
  black_mangrove_logs: {
    key: "black_mangrove_logs",
    itemType: ItemType.MATERIAL,
    name: "Black Mangrove Logs",
    description: "Logs from a Black Mangrove.",
  },
  frangipani_logs: {
    key: "frangipani_logs",
    itemType: ItemType.MATERIAL,
    name: "Frangipani Logs",
    description: "Logs from a Frangipani.",
  },
  palm_fan_logs: {
    key: "palm_fan_logs",
    itemType: ItemType.MATERIAL,
    name: "Palm Fan Logs",
    description: "Logs from a Palm Fan Tree.",
  },
  umbrella_logs: {
    key: "umbrella_logs",
    itemType: ItemType.MATERIAL,
    name: "Umbrella Logs",
    description: "Logs from a Umbrella Tree.",
  },
  joshua_tree_logs: {
    key: "joshua_tree_logs",
    itemType: ItemType.MATERIAL,
    name: "Joshua Tree Logs",
    description: "Logs from a Joshua Tree.",
  },
  palm_logs: {
    key: "palm_logs",
    itemType: ItemType.MATERIAL,
    name: "Palm Logs",
    description: "Logs from a Palm Tree.",
  },
  royal_palm_logs: {
    key: "royal_palm_logs",
    itemType: ItemType.MATERIAL,
    name: "Royal Palm Logs",
    description: "Logs from a Royal Palm Tree.",
  },
  russian_olive_logs: {
    key: "russian_olive_logs",
    itemType: ItemType.MATERIAL,
    name: "Russian Olive Logs",
    description: "Logs from a Russian Olive.",
  },
  birch_logs: {
    key: "birch_logs",
    itemType: ItemType.MATERIAL,
    name: "Birch Logs",
    description: "Logs from a Birch Tree.",
  },
  cedar_logs: {
    key: "cedar_logs",
    itemType: ItemType.MATERIAL,
    name: "Cedar Logs",
    description: "Logs from a Cedar Tree.",
  },
  eucalyptus_logs: {
    key: "eucalyptus_logs",
    itemType: ItemType.MATERIAL,
    name: "Eucalyptus Logs",
    description: "Logs from a Eucalyptus Tree.",
  },
  jacada_logs: {
    key: "jacada_logs",
    itemType: ItemType.MATERIAL,
    name: "Jacada Logs",
    description: "Logs from a Jacada Tree.",
  },
  ficus_logs: {
    key: "ficus_logs",
    itemType: ItemType.MATERIAL,
    name: "Ficus Logs",
    description: "Logs from a Ficus Tree.",
  },
  maple_logs: {
    key: "maple_logs",
    itemType: ItemType.MATERIAL,
    name: "Maple Logs",
    description: "Logs from a Maple Tree.",
  },
  mesquite_logs: {
    key: "mesquite_logs",
    itemType: ItemType.MATERIAL,
    name: "Mesquite Logs",
    description: "Logs from a Mesquite Tree.",
  },
  oak_logs: {
    key: "oak_logs",
    itemType: ItemType.MATERIAL,
    name: "Oak Logs",
    description: "Logs from a Oak Tree.",
  },
  pine_logs: {
    key: "pine_logs",
    itemType: ItemType.MATERIAL,
    name: "Pine Logs",
    description: "Logs from a Pine Tree.",
  },
};

export function isItemTreeLog(key: ItemKey): key is TreeLogItemKey {
  return key in treeLogs;
}
