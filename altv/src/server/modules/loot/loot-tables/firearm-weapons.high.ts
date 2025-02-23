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
  FirearmWeaponItemKey,
  getAmmoKeyForAmmoGroup,
  getWeaponAmmoGroup,
  getWeaponClipSize,
} from "@shared/modules/items";
import { rollOption } from "@shared/utility/random";
import { LootTable } from "../loot.types";

/**
 * High quality firearms drop
 */
export const FIREARM_WEAPONS_HIGH: LootTable = {
  key: "firearm-weapons-high",
  type: AirDropType.FirearmWeapons,
  score: 10,
  getItemsAmount() {
    return _.random(6, 10);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey | AmmoItemKey {
    const matchesWeapon =
      isItemKeyFirearmWeapon(itemKey) &&
      getItemTier(itemKey) ===
      rollOption(
        [
          [1, ItemTier.S],
          [3, ItemTier.A],
          [5, ItemTier.B],
        ],
        seed,
      );

    const matchesAmmo =
      isItemKeyAmmo(itemKey) &&
      [ItemTier.E, ItemTier.D, ItemTier.C, ItemTier.B, ItemTier.A, ItemTier.S].includes(
        getItemTier(itemKey),
      );

    return matchesWeapon || matchesAmmo;
  },
  createItem(itemKey: FirearmWeaponItemKey | AmmoItemKey) {
    if (isItemKeyFirearmWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollOption([
          [30, ItemGrade.RARE],
          [50, ItemGrade.EPIC],
          [5, ItemGrade.LEGENDARY],
        ]),
        clip: createItem(getAmmoKeyForAmmoGroup(getWeaponAmmoGroup(itemKey)), {
          amount: getWeaponClipSize(itemKey),
        }),
      });
    }
    return createItem(itemKey, {
      amount: ~~(Math.random() * 8) * 100 + 200,
    });
  },
};
