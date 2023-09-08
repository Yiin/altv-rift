import { makeEnum } from "@shared/utility/make-enum";
import { ItemKey } from "../types";
import { getItemInfoByKey } from "../items-registry";
import { isItemKeyFishingRod, isItemKeyWeapon } from "../registry";
import { isItemKeyAmmo } from "../registry/ammo/ammo.items";
import { isItemKeyFirearmWeapon } from "../registry/weapons/firearm-weapon.items";
import { isItemKeyFishBait } from "../registry/fish-bait.items";

export const CombineType = makeEnum({
  None: "None",
  EquipAmmo: "EquipAmmo",
  EquipFishBait: "EquipFishBait",
});

export function getCombineType(target: ItemKey, source: ItemKey, reverse = false) {
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
