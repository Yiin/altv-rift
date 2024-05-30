import { Item } from "../../types";
import { HatchetItem, HatchetItemInfo, HatchetItemKey, isItemKeyHatchet } from "./hatchet.items";
import { PickaxeItem, PickaxeItemInfo, PickaxeItemKey, isItemKeyPickaxe } from "./pickaxe.items";
import {
  FishingRodItem,
  FishingRodItemInfo,
  FishingRodItemKey,
  isItemKeyFishingRod,
} from "./fishing-rod.items";

export type ToolItemKey = HatchetItemKey | PickaxeItemKey | FishingRodItemKey;
export type ToolItem = HatchetItem | PickaxeItem | FishingRodItem;
export type ToolItemInfo = HatchetItemInfo | PickaxeItemInfo | FishingRodItemInfo;

export function isItemKeyTool(key: string): key is ToolItemKey {
  return isItemKeyHatchet(key) || isItemKeyPickaxe(key) || isItemKeyFishingRod(key);
}

export function isItemTool(item: Item): item is ToolItem {
  return isItemKeyTool(item.key);
}
