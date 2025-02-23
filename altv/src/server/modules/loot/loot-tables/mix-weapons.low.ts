import _ from "lodash";
import { AirDropType } from "@shared/modules/air-drops";
import {
  ItemKey,
  WeaponItemKey,
  AmmoItemKey,
  ItemTier,
  getItemTier,
  isItemKeyAmmo,
  isItemKeyFirearmWeapon,
  createItem,
  ItemGrade,
  isItemKeyThrowableWeapon,
  isItemKeyMeleeWeapon,
  getWeaponAmmoGroup,
  getAmmoKeyForAmmoGroup,
  getWeaponClipSize,
} from "@shared/modules/items";
import { rollOption } from "@shared/utility/random";
import { LootTable } from "../loot.types";

export const MIX_WEAPONS_LOW: LootTable = {
  key: "mix-weapons-low",
  type: AirDropType.MixWeapons,
  score: 1,
  getItemsAmount() {
    return _.random(7, 10);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey | AmmoItemKey {
    const matchesWeapon =
      (isItemKeyFirearmWeapon(itemKey) &&
        getItemTier(itemKey) ===
          rollOption(
            [
              [50, ItemTier.F],
              [30, ItemTier.E],
              [20, ItemTier.D],
            ],
            seed,
          )) ||
      (isItemKeyThrowableWeapon(itemKey) &&
        getItemTier(itemKey) ===
          rollOption(
            [
              [30, ItemTier.E],
              [20, ItemTier.D],
            ],
            seed,
          )) ||
      (isItemKeyMeleeWeapon(itemKey) &&
        getItemTier(itemKey) ===
          rollOption(
            [
              [10, ItemTier.F],
              [30, ItemTier.E],
              [20, ItemTier.D],
              [20, ItemTier.C],
            ],
            seed,
          ));

    const matchesAmmo =
      isItemKeyAmmo(itemKey) && [ItemTier.E, ItemTier.D, ItemTier.C].includes(getItemTier(itemKey));

    return matchesWeapon || matchesAmmo;
  },
  createItem(itemKey: ItemKey) {
    if (isItemKeyFirearmWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollOption([
          [50, ItemGrade.UNCOMMON],
          [30, ItemGrade.RARE],
          [5, ItemGrade.EPIC],
        ]),
        clip: createItem(getAmmoKeyForAmmoGroup(getWeaponAmmoGroup(itemKey)), {
          amount: getWeaponClipSize(itemKey),
        }),
      });
    }
    if (isItemKeyThrowableWeapon(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 5) * 10 + 20,
      });
    }
    if (isItemKeyMeleeWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollOption([
          [50, ItemGrade.UNCOMMON],
          [30, ItemGrade.RARE],
          [10, ItemGrade.EPIC],
          [5, ItemGrade.LEGENDARY],
        ]),
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
