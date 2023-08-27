import { ItemKey } from "../types";
import { isItemWeapon } from "../weapons";
import { isItemKeyAmmo } from "../ammo";

export function isItemEquipable(key: ItemKey) {
  return isItemWeapon(key) || isItemKeyAmmo(key);
}
