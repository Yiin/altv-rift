import { ItemKey } from "../types";
import { getItemInfoByKey } from "../items-registry";
import { isItemKeyFishingRod, isItemKeyWeapon } from "../registry";
import { isItemKeyAmmo } from "../registry/ammo/ammo.items";
import { isItemKeyFirearmWeapon } from "../registry/weapons/firearm-weapon.items";
import { isItemKeyFishBait } from "../registry/fish-bait.items";

export enum CombineType {
  None = "None",
  EquipAmmo = "EquipAmmo",
  EquipFishBait = "EquipFishBait",
}

export function getCombineType(
  target: ItemKey,
  source: ItemKey,
  reverse = false,
): [CombineType, boolean] {
  // Weapon - Ammo
  if (isItemKeyWeapon(target) && isItemKeyAmmo(source)) {
    if (!isItemKeyFirearmWeapon(target)) {
      return [CombineType.None, reverse];
    }

    const { ammoGroup: weaponAmmoGroup } = getItemInfoByKey(target);
    const { group: ammoGroup } = getItemInfoByKey(source);

    if (weaponAmmoGroup === ammoGroup) {
      return [CombineType.EquipAmmo, reverse];
    }
  }

  // Fishing rod - Fish bait
  if (isItemKeyFishingRod(target) && isItemKeyFishBait(source)) {
    return [CombineType.EquipFishBait, reverse];
  }

  // Check reverse
  if (!reverse) {
    return getCombineType(source, target, true);
  }

  return [CombineType.None, reverse];
}
