import _ from "lodash";
import { AirDropType } from "@shared/modules/air-drops";
import {
  ItemKey,
  WeaponItemKey,
  ItemTier,
  getItemTier,
  createItem,
  ItemGrade,
  isItemKeyConsumable,
  isItemKeyMaterial,
  isItemKeyWeapon,
} from "@shared/modules/items";
import { rollOption } from "@shared/utility/random";
import { LootTable } from "../types";

export const RANDOM_LOOT: LootTable = {
  key: "random-loot",
  score: 1,
  getItemsAmount() {
    return _.random(3, 6);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is WeaponItemKey {
    const matchesConsumable = isItemKeyConsumable(itemKey);
    const matchesMaterial = isItemKeyMaterial(itemKey);
    const matchesWeapon =
      isItemKeyWeapon(itemKey) &&
      rollOption(
        [
          [5, true], // 5% chance for a weapon
          [95, false],
        ],
        seed,
      );

    return matchesConsumable || matchesMaterial || matchesWeapon;
  },
  createItem(itemKey: ItemKey) {
    if (isItemKeyWeapon(itemKey)) {
      return createItem(itemKey, {
        grade: rollOption([
          [50, ItemGrade.UNCOMMON],
          [20, ItemGrade.RARE],
          [1, ItemGrade.LEGENDARY],
        ]),
      });
    }
    if (isItemKeyConsumable(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 3) + 1,
      });
    }
    if (isItemKeyMaterial(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 8) * 5 + 10,
      });
    }
    throw new Error(`Invalid item key ${itemKey}`);
  },
};
