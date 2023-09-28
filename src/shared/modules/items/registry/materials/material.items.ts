import { Item, ItemKey } from "../../types";
import {
  FoodIngredientItem,
  FoodIngredientItemInfo,
  FoodIngredientItemKey,
  isItemKeyFoodIngredient,
} from "./food-ingredient.items";
import { TreeLogItem, TreeLogItemInfo, TreeLogItemKey, isItemKeyTreeLog } from "./tree-log.items";

export type MaterialItemKey = FoodIngredientItemKey | TreeLogItemKey;
export type MaterialItemInfo = FoodIngredientItemInfo | TreeLogItemInfo;
export type MaterialItem = FoodIngredientItem | TreeLogItem;

export function isItemKeyMaterial(key: ItemKey): key is MaterialItemKey {
  return isItemKeyFoodIngredient(key) || isItemKeyTreeLog(key);
}

export function isItemMaterial(item: Item): item is MaterialItem {
  return isItemKeyMaterial(item.key);
}
