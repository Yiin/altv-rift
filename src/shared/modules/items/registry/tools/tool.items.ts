import { Item } from "../../types";
import { HatchetItem, HatchetItemInfo, HatchetItemKey, isItemKeyHatchet } from "./hatchet.items";
import { PickaxeItem, PickaxeItemInfo, PickaxeItemKey, isItemKeyPickaxe } from "./pickaxe.items";

export type ToolItemKey = HatchetItemKey | PickaxeItemKey;
export type ToolItem = HatchetItem | PickaxeItem;
export type ToolItemInfo = HatchetItemInfo | PickaxeItemInfo;

export function isItemKeyTool(key: string): key is ToolItemKey {
  return isItemKeyHatchet(key) || isItemKeyPickaxe(key);
}

export function isItemTool(item: Item): item is ToolItem {
  return isItemKeyTool(item.key);
}
