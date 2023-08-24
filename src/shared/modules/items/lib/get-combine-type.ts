import { ItemType } from "@prisma/client";
import { makeEnum } from "@shared/utility/make-enum";
import { ItemKey } from "../types";
import { getItemInfoByKey } from "../registry";
import { isItemWeapon } from "../weapons";
import { isItemAmmo } from "../ammo";

export const CombineType = makeEnum({
  None: "None",
  EquipAmmo: "EquipAmmo",
});

export function getCombineType(target: ItemKey, source: ItemKey, reverse = false) {
  if (isItemWeapon(target) && isItemAmmo(source)) {
    const weaponInfo = getItemInfoByKey(target);

    if (weaponInfo.itemType !== ItemType.FIREARM_WEAPON) {
      return [CombineType.None, reverse];
    }

    const weaponGroup = weaponInfo.ammoGroup;
    const ammoGroup = getItemInfoByKey(source).group;

    if (weaponGroup === ammoGroup) {
      return [CombineType.EquipAmmo, reverse];
    }
  }

  if (!reverse) {
    return getCombineType(source, target, true);
  }

  return [CombineType.None, reverse];
}
