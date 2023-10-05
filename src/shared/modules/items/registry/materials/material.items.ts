import { Item, ItemKey } from "../../types";
import {
  FoodIngredientItem,
  FoodIngredientItemInfo,
  FoodIngredientItemKey,
  isItemKeyFoodIngredient,
} from "./food-ingredient.items";
import { MetalItem, MetalItemInfo, MetalItemKey } from "./metal.items";
import { TreeLogItem, TreeLogItemInfo, TreeLogItemKey, isItemKeyTreeLog } from "./tree-log.items";
import { WoodItem, WoodItemInfo, WoodItemKey } from "./wood.items";

export type MaterialItemKey = FoodIngredientItemKey | TreeLogItemKey | WoodItemKey | MetalItemKey;
export type MaterialItemInfo =
  | FoodIngredientItemInfo
  | TreeLogItemInfo
  | WoodItemInfo
  | MetalItemInfo;
export type MaterialItem = FoodIngredientItem | TreeLogItem | WoodItem | MetalItem;

export function isItemKeyMaterial(key: ItemKey): key is MaterialItemKey {
  return isItemKeyFoodIngredient(key) || isItemKeyTreeLog(key);
}

export function isItemMaterial(item: Item): item is MaterialItem {
  return isItemKeyMaterial(item.key);
}
