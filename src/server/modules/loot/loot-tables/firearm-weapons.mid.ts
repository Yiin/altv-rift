import _ from "lodash";
import { AirDropType } from "@shared/modules/air-drops";
import {
  ItemKey,
  WeaponItemKey,
  AmmoItemKey,
  isItemKeyFirearmWeapon,
  getItemTier,
  ItemTier,
  isItemKeyAmmo,
  createItem,
  ItemGrade,
  getAmmoKeyForAmmoGroup,
  getWeaponAmmoGroup,
  getWeaponClipSize,
} from "@shared/modules/items";
import { rollItem } from "@shared/utility/random";
import { LootTable } from "../types";

export const FIREARM_WEAPONS_MID: LootTable = {
  type: AirDropType.FirearmWeapons,
  score: 2,
  getItemsAmount() {
    return _.random(5, 8);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey | AmmoItemKey {
    const matchesWeapon =
      isItemKeyFirearmWeapon(itemKey) &&
      getItemTier(itemKey) ===
        rollItem(
          [
            [10, ItemTier.E],
            [30, ItemTier.D],
            [40, ItemTier.C],
            [20, ItemTier.B],
          ],
          seed,
        );

    const matchesAmmo =
      isItemKeyAmmo(itemKey) && [ItemTier.D, ItemTier.C, ItemTier.B].includes(getItemTier(itemKey));

    return matchesWeapon || matchesAmmo;
  },
  createItem(itemKey: ItemKey) {
    if (isItemKeyFirearmWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollItem([
          [30, ItemGrade.UNCOMMON],
          [40, ItemGrade.RARE],
          [20, ItemGrade.EPIC],
          [10, ItemGrade.LEGENDARY],
        ]),
        clip: createItem(getAmmoKeyForAmmoGroup(getWeaponAmmoGroup(itemKey)), {
          amount: getWeaponClipSize(itemKey),
        }),
      });
    }
    if (isItemKeyAmmo(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 10) * 100 + 300,
      });
    }
    throw new Error(`Invalid item key ${itemKey}`);
  },
};
