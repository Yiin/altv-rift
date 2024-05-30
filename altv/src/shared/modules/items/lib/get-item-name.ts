import { getItemInfoByKey } from "../items-registry";
import { isItemKeyWeapon, getWeaponData } from "../registry";
import { ItemKey } from "../types";

/**
 * Gives the display name for an item by it's key.
 */
export function getItemName(key: ItemKey): string {
  if (isItemKeyWeapon(key)) {
    const itemInfo = getItemInfoByKey(key);
    return getWeaponData(itemInfo.hash).Name;
  }

  const itemInfo = getItemInfoByKey(key);
  return itemInfo?.name ?? "Unknown Item";
}
