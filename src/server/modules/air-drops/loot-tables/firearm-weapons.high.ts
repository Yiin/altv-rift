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
import { rollItem } from "@shared/utility/random";

/**
 * High quality firearms drop
 */
export default {
  type: AirDropType.FirearmWeapons,
  score: 10,
  getItemsAmount() {
    return _.random(6, 10);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey | AmmoItemKey {
    const matchesWeapon =
      isItemKeyFirearmWeapon(itemKey) &&
      getItemTier(itemKey) ===
        rollItem(
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
        grade: rollItem([
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
