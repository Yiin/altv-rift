import { EquipmentSlot } from "@shared/interfaces";
import { isItemKeyAmmo, isItemKeyClothing, isItemKeyFishingRod, isItemKeyWeapon } from "../registry";
import { isItemKeyTool } from "../registry/tool.items";
import { Item, ItemKey } from "../types";
import { getItemInfoByKey } from "../items-registry";

/**
 * Determines the equipment slot suitable for the given item,
 */
export function getItemKeyEquipmentSlot(key: ItemKey): EquipmentSlot | undefined {
  if (isItemKeyAmmo(key)) {
    return "ammo";
  }
  if (isItemKeyWeapon(key)) {
    return "weapon";
  }
  if (isItemKeyClothing(key)) {
    const itemInfo = getItemInfoByKey(key);
    return itemInfo.equipmentSlot;
  }
  if (isItemKeyTool(key) || isItemKeyFishingRod(key)) {
    return "tool";
  }
  return;
}

export function getItemEquipmentSlot(item: Item): EquipmentSlot | undefined {
  return getItemKeyEquipmentSlot(item.key);
}
