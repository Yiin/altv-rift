import { Item, ItemKey } from "../../types";
import {
  FoodIngredientItem,
  FoodIngredientItemInfo,
  FoodIngredientItemKey,
  isItemKeyFoodIngredient,
} from "./food-ingredient.items";
import { MetalItem, MetalItemInfo, MetalItemKey, isItemKeyMetal } from "./metal.items";
import { SandItem, SandItemInfo, SandItemKey, isItemKeySand } from "./sand.items";
import { TreeLogItem, TreeLogItemInfo, TreeLogItemKey, isItemKeyTreeLog } from "./tree-log.items";
import { WoodItem, WoodItemInfo, WoodItemKey, isItemKeyWood } from "./wood.items";

export type MaterialItemKey =
  | FoodIngredientItemKey
  | TreeLogItemKey
  | WoodItemKey
  | MetalItemKey
  | SandItemKey;
export type MaterialItemInfo =
  | FoodIngredientItemInfo
  | TreeLogItemInfo
  | WoodItemInfo
  | MetalItemInfo
  | SandItemInfo;
export type MaterialItem = FoodIngredientItem | TreeLogItem | WoodItem | MetalItem | SandItem;

export function isItemKeyMaterial(key: ItemKey): key is MaterialItemKey {
  return (
    isItemKeyFoodIngredient(key) ||
    isItemKeyTreeLog(key) ||
    isItemKeyWood(key) ||
    isItemKeyMetal(key) ||
    isItemKeySand(key)
  );
}

export function isItemMaterial(item: Item): item is MaterialItem {
  return isItemKeyMaterial(item.key);
}
