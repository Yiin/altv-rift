import { ItemKey } from "..";
import { ItemType } from "../item-type";

export const materials = {
  large_beech_logs: {
    key: "large_beech_logs",
    itemType: ItemType.MATERIAL,
    name: "Large Beech Logs",
    description: "Large logs from a Beech Tree.",
  },
  black_mangrove_logs_large: {
    key: "black_mangrove_logs_large",
    itemType: ItemType.MATERIAL,
    name: "Black Mangrove Logs (Large)",
    description: "Large logs from a Black Mangrove.",
  },
  black_mangrove_logs_medium: {
    key: "black_mangrove_logs_medium",
    itemType: ItemType.MATERIAL,
    name: "Black Mangrove Logs (Medium)",
    description: "Medium logs from a Black Mangrove.",
  },
  frangipani_logs_large: {
    key: "frangipani_logs_large",
    itemType: ItemType.MATERIAL,
    name: "Frangipani Logs (Large)",
    description: "Large logs from a Frangipani.",
  },
  palm_fan_logs: {
    key: "palm_fan_logs",
    itemType: ItemType.MATERIAL,
    name: "Palm Fan Logs",
    description: "Logs from a Palm Fan Tree.",
  },
  umbrella_logs_medium: {
    key: "umbrella_logs_medium",
    itemType: ItemType.MATERIAL,
    name: "Umbrella Logs (Medium)",
    description: "Medium logs from a Umbrella Tree.",
  },
  umbrella_logs_small: {
    key: "umbrella_logs_small",
    itemType: ItemType.MATERIAL,
    name: "Umbrella Logs (Small)",
    description: "Small logs from a Umbrella Tree.",
  },
  joshua_tree_logs: {
    key: "joshua_tree_logs",
    itemType: ItemType.MATERIAL,
    name: "Joshua Tree Logs",
    description: "Logs from a Joshua Tree.",
  },
  medium_palm_logs: {
    key: "medium_palm_logs",
    itemType: ItemType.MATERIAL,
    name: "Palm Logs (Medium)",
    description: "Medium logs from a Palm Tree.",
  },
  small_palm_logs: {
    key: "small_palm_logs",
    itemType: ItemType.MATERIAL,
    name: "Palm Logs (Small)",
    description: "Small logs from a Palm Tree.",
  },
  russian_olive_logs_winter: {
    key: "russian_olive_logs_winter",
    itemType: ItemType.MATERIAL,
    name: "Russian Olive Logs (Winter)",
    description: "Logs from a Russian Olive (Winter).",
  },
  dead_pine_logs: {
    key: "dead_pine_logs",
    itemType: ItemType.MATERIAL,
    name: "Dead Pine Logs",
    description: "Logs from a Dead Pine Tree.",
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
  small_cedar_logs: {
    key: "small_cedar_logs",
    itemType: ItemType.MATERIAL,
    name: "Cedar Logs (Small)",
    description: "Small logs from a Cedar Tree.",
  },
  english_oak_logs: {
    key: "english_oak_logs",
    itemType: ItemType.MATERIAL,
    name: "English Oak Logs",
    description: "Logs from a English Oak.",
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
  wild_red_cedar_logs: {
    key: "wild_red_cedar_logs",
    itemType: ItemType.MATERIAL,
    name: "Wild Red Cedar Logs",
    description: "Logs from a Wild Red Cedar.",
  },
  dead_wild_red_cedar_logs: {
    key: "dead_wild_red_cedar_logs",
    itemType: ItemType.MATERIAL,
    name: "Dead Wild Red Cedar Logs",
    description: "Logs from a Dead Wild Red Cedar.",
  },
} as const;

export type MaterialItemKey = keyof typeof materials;

export function isItemMaterial(key: ItemKey): key is MaterialItemKey {
  return key in materials;
}
