import _ from "lodash";
import {
  ItemKey,
  ScrapItemKey,
  MetalItemKey,
  AmmoItemKey,
  isItemKeyScrap,
  isItemKeyMetal,
  isItemKeyAmmo,
  ItemTier,
  getItemTier,
  createItem,
  ItemGrade,
} from "@shared/modules/items";
import { rollOption } from "@shared/utility/random";
import { LootTable } from "../types";

export const SCRAP_METAL_AMMO_LOW: LootTable = {
  score: 1,
  getItemsAmount() {
    return _.random(2, 3);
  },
  filterItemKey(
    itemKey: ItemKey,
    seed: number,
  ): itemKey is ScrapItemKey | MetalItemKey | AmmoItemKey {
    const matchesScrap = isItemKeyScrap(itemKey);
    const matchesMetal = isItemKeyMetal(itemKey);
    const matchesAmmo =
      isItemKeyAmmo(itemKey) && [ItemTier.E, ItemTier.D, ItemTier.C].includes(getItemTier(itemKey));

    return matchesScrap || matchesMetal || matchesAmmo;
  },
  createItem(itemKey: ItemKey) {
    if (isItemKeyScrap(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 10) * 50 + 100,
        grade: rollOption([
          [50, ItemGrade.COMMON],
          [30, ItemGrade.UNCOMMON],
          [20, ItemGrade.RARE],
        ]),
      });
    }
    if (isItemKeyMetal(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 5) * 50 + 50,
        grade: rollOption([
          [50, ItemGrade.COMMON],
          [30, ItemGrade.UNCOMMON],
          [10, ItemGrade.RARE],
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
