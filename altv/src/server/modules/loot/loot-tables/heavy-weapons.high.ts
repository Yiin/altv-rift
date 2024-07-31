import _ from "lodash";
import { AirDropType } from "@shared/modules/air-drops";
import {
  AmmoItemKey,
  ItemGrade,
  ItemKey,
  ItemTier,
  WeaponItemKey,
  createItem,
  getAmmoGroup,
  getAmmoKeyForAmmoGroup,
  getItemTier,
  getWeaponAmmoGroup,
  getWeaponClipSize,
  getWeaponGroup,
  isItemKeyAmmo,
  isItemKeyFirearmWeapon,
} from "@shared/modules/items";
import { WeaponGroup, AmmoGroup } from "@shared/modules/items/registry/weapons/weapon-groups";
import { rollOption } from "@shared/utility/random";
import { LootTable } from "../types";

export const HEAVY_WEAPONS_HIGH: LootTable = {
  key: "heavy-weapons-high",
  type: AirDropType.HeavyWeapons,
  score: 3,
  getItemsAmount() {
    return _.random(2, 4);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey | AmmoItemKey {
    const matchesWeapon =
      isItemKeyFirearmWeapon(itemKey) &&
      [ItemTier.B, ItemTier.A, ItemTier.S].includes(getItemTier(itemKey)) &&
      [WeaponGroup.HEAVY, WeaponGroup.SHOTGUN, WeaponGroup.SNIPER_RIFLE].includes(
        getWeaponGroup(itemKey),
      );

    const matchesAmmo =
      isItemKeyAmmo(itemKey) &&
      [ItemTier.B, ItemTier.A, ItemTier.S].includes(getItemTier(itemKey)) &&
      [AmmoGroup.MACHINE_GUN, AmmoGroup.SHOTGUN, AmmoGroup.SNIPER_RIFLE].includes(
        getAmmoGroup(itemKey),
      );

    return matchesWeapon || matchesAmmo;
  },
  createItem(itemKey: ItemKey) {
    if (isItemKeyFirearmWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollOption([
          [20, ItemGrade.RARE],
          [40, ItemGrade.EPIC],
          [30, ItemGrade.LEGENDARY],
          [10, ItemGrade.CONTRABAND],
        ]),
        clip: createItem(getAmmoKeyForAmmoGroup(getWeaponAmmoGroup(itemKey)), {
          amount: getWeaponClipSize(itemKey),
        }),
      });
    }
    if (isItemKeyAmmo(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 8) * 100 + 200,
      });
    }
    throw new Error(`Invalid item key ${itemKey}`);
  },
};
