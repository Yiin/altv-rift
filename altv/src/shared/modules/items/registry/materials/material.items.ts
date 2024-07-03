import { Item } from "../../types";
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
import { OreItem, OreItemInfo, OreItemKey, isItemKeyOre } from "./ore.items";
import { ScrapItem, ScrapItemInfo, ScrapItemKey, isItemKeyScrap } from "./scrap.items";
import { LeatherItem, LeatherItemInfo, LeatherItemKey, isItemKeyLeather } from "./leather.items";
import { HideItem, HideItemInfo, HideItemKey, isItemKeyHide } from "./hide.items";

export type MaterialItemKey =
  | FoodIngredientItemKey
  | TreeLogItemKey
  | WoodItemKey
  | MetalItemKey
  | LeatherItemKey
  | SandItemKey
  | OreItemKey
  | HideItemKey
  | ScrapItemKey;

export type MaterialItemInfo =
  | FoodIngredientItemInfo
  | TreeLogItemInfo
  | WoodItemInfo
  | MetalItemInfo
  | LeatherItemInfo
  | SandItemInfo
  | OreItemInfo
  | HideItemInfo
  | ScrapItemInfo;

export type MaterialItem =
  | FoodIngredientItem
  | TreeLogItem
  | WoodItem
  | MetalItem
  | LeatherItem
  | SandItem
  | OreItem
  | HideItem
  | ScrapItem;

export function isItemKeyMaterial(key: string): key is MaterialItemKey {
  return (
    isItemKeyFoodIngredient(key) ||
    isItemKeyTreeLog(key) ||
    isItemKeyWood(key) ||
    isItemKeyMetal(key) ||
    isItemKeyLeather(key) ||
    isItemKeySand(key) ||
    isItemKeyOre(key) ||
    isItemKeyHide(key) ||
    isItemKeyScrap(key)
  );
}

export function isItemMaterial(item: Item): item is MaterialItem {
  return isItemKeyMaterial(item.key);
}
