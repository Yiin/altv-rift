import { ItemKey } from "../types";
import { isItemWeapon } from "../weapons";
import { isItemAmmo } from "../ammo";

export function isItemEquipable(key: ItemKey) {
  return isItemWeapon(key) || isItemAmmo(key);
}
