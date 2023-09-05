import { ItemKey } from "../types";
import { foodIngredients } from "./food-ingredients";
import { treeLogs } from "./tree-logs";

export type MaterialItemKey = keyof typeof materials;
export type MaterialItemInfo = (typeof materials)[MaterialItemKey];

export const materials = {
  ...treeLogs,
  ...foodIngredients,
} as const;

export function isItemMaterial(key: ItemKey): key is MaterialItemKey {
  return key in materials;
}
