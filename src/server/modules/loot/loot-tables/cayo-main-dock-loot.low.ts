import _ from "lodash";
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
  isItemKeyConsumable,
  isItemKeyMaterial,
} from "@shared/modules/items";
import { rollItem } from "@shared/utility/random";
import { LootTable } from "../types";

export const CAYO_MAIN_DOCK_LOOT: LootTable = {
  score: 1,
  getItemsAmount() {
    return _.random(4, 6);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey | AmmoItemKey {
    const matchesWeapon =
      (isItemKeyFirearmWeapon(itemKey) &&
        [ItemTier.D, ItemTier.C].includes(getItemTier(itemKey))) ||
      (isItemKeyThrowableWeapon(itemKey) &&
        [ItemTier.D, ItemTier.C].includes(getItemTier(itemKey))) ||
      (isItemKeyMeleeWeapon(itemKey) && [ItemTier.D, ItemTier.C].includes(getItemTier(itemKey)));

    const matchesAmmo =
      isItemKeyAmmo(itemKey) && [ItemTier.D, ItemTier.C].includes(getItemTier(itemKey));

    const matchesConsumable =
      isItemKeyConsumable(itemKey) && [ItemTier.F, ItemTier.E].includes(getItemTier(itemKey));

    const matchesMaterial = isItemKeyMaterial(itemKey);

    return matchesWeapon || matchesAmmo || matchesConsumable || matchesMaterial;
  },
  createItem(itemKey: ItemKey) {
    if (isItemKeyFirearmWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollItem([
          [70, ItemGrade.COMMON],
          [30, ItemGrade.UNCOMMON],
        ]),
        clip: createItem(getAmmoKeyForAmmoGroup(getWeaponAmmoGroup(itemKey)), {
          amount: getWeaponClipSize(itemKey),
        }),
      });
    }
    if (isItemKeyThrowableWeapon(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 3) * 5 + 10,
      });
    }
    if (isItemKeyMeleeWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollItem([
          [80, ItemGrade.COMMON],
          [20, ItemGrade.UNCOMMON],
        ]),
      });
    }
    if (isItemKeyAmmo(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 4) * 50 + 100,
      });
    }
    if (isItemKeyConsumable(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 10) + 2,
      });
    }
    if (isItemKeyMaterial(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 5) * 10 + 20,
      });
    }
    throw new Error(`Invalid item key ${itemKey}`);
  },
};
