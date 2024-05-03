import _ from "lodash";
import { AirDropType } from "@shared/modules/air-drops";
import {
  ItemKey,
  WeaponItemKey,
  AmmoItemKey,
  isItemKeyFirearmWeapon,
  ItemTier,
  getItemTier,
  getWeaponGroup,
  isItemKeyAmmo,
  getAmmoGroup,
  createItem,
  ItemGrade,
  getAmmoKeyForAmmoGroup,
  getWeaponAmmoGroup,
  getWeaponClipSize,
} from "@shared/modules/items";
import { WeaponGroup, AmmoGroup } from "@shared/modules/items/registry/weapons/weapon-groups";
import { rollItem } from "@shared/utility/random";
import { LootTable } from "../types";

export const HANDGUN_WEAPONS_LOW: LootTable = {
  type: AirDropType.HandgunWeapons,
  score: 1,
  getItemsAmount() {
    return _.random(3, 6);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey | AmmoItemKey {
    const matchesWeapon =
      isItemKeyFirearmWeapon(itemKey) &&
      [ItemTier.F, ItemTier.E, ItemTier.D].includes(getItemTier(itemKey)) &&
      getWeaponGroup(itemKey) === WeaponGroup.HANDGUN;

    const matchesAmmo =
      isItemKeyAmmo(itemKey) &&
      [ItemTier.E, ItemTier.D, ItemTier.C].includes(getItemTier(itemKey)) &&
      [AmmoGroup.HANDGUN].includes(getAmmoGroup(itemKey));

    return matchesWeapon || matchesAmmo;
  },
  createItem(itemKey: ItemKey) {
    if (isItemKeyFirearmWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollItem([
          [50, ItemGrade.COMMON],
          [30, ItemGrade.UNCOMMON],
          [20, ItemGrade.RARE],
        ]),
        clip: createItem(getAmmoKeyForAmmoGroup(getWeaponAmmoGroup(itemKey)), {
          amount: getWeaponClipSize(itemKey),
        }),
      });
    }
    if (isItemKeyAmmo(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 6) * 100 + 100,
      });
    }
    throw new Error(`Invalid item key ${itemKey}`);
  },
};
