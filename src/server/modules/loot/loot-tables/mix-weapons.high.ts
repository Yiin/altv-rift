import _ from "lodash";
import { AirDropType } from "@shared/modules/air-drops";
import {
  ItemKey,
  WeaponItemKey,
  AmmoItemKey,
  isItemKeyFirearmWeapon,
  getItemTier,
  ItemTier,
  isItemKeyThrowableWeapon,
  isItemKeyMeleeWeapon,
  isItemKeyAmmo,
  createItem,
  ItemGrade,
  getAmmoKeyForAmmoGroup,
  getWeaponAmmoGroup,
  getWeaponClipSize,
} from "@shared/modules/items";
import { rollOption } from "@shared/utility/random";
import { LootTable } from "../types";

export const MIX_WEAPONS_HIGH: LootTable = {
  type: AirDropType.MixWeaponsLarge,
  score: 3,
  getItemsAmount() {
    return _.random(12, 18);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey | AmmoItemKey {
    const matchesWeapon =
      (isItemKeyFirearmWeapon(itemKey) &&
        getItemTier(itemKey) ===
          rollOption(
            [
              [10, ItemTier.D],
              [30, ItemTier.C],
              [40, ItemTier.B],
              [20, ItemTier.A],
            ],
            seed,
          )) ||
      (isItemKeyThrowableWeapon(itemKey) &&
        getItemTier(itemKey) ===
          rollOption(
            [
              [20, ItemTier.C],
              [30, ItemTier.B],
              [10, ItemTier.A],
            ],
            seed,
          )) ||
      (isItemKeyMeleeWeapon(itemKey) &&
        getItemTier(itemKey) ===
          rollOption(
            [
              [10, ItemTier.D],
              [30, ItemTier.C],
              [40, ItemTier.B],
              [20, ItemTier.A],
            ],
            seed,
          ));

    const matchesAmmo =
      isItemKeyAmmo(itemKey) && [ItemTier.C, ItemTier.B, ItemTier.A].includes(getItemTier(itemKey));

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
    if (isItemKeyThrowableWeapon(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 8) * 10 + 50,
      });
    }
    if (isItemKeyMeleeWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollOption([
          [20, ItemGrade.EPIC],
          [40, ItemGrade.LEGENDARY],
          [30, ItemGrade.CONTRABAND],
          [10, ItemGrade.LIMITED],
        ]),
      });
    }
    if (isItemKeyAmmo(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 12) * 100 + 500,
      });
    }
    throw new Error(`Invalid item key ${itemKey}`);
  },
};
