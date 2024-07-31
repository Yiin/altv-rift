import _ from "lodash";
import {
  ItemKey,
  WoodItemKey,
  ScrapItemKey,
  MetalItemKey,
  isItemKeyWood,
  isItemKeyScrap,
  isItemKeyMetal,
  createItem,
  ItemGrade,
} from "@shared/modules/items";
import { rollOption } from "@shared/utility/random";
import { LootTable } from "../types";

export const WOOD_SCRAP_METAL_LOW: LootTable = {
  key: "wood-scrap-metal-low",
  score: 1,
  getItemsAmount() {
    return _.random(2, 4);
  },
  filterItemKey(
    itemKey: ItemKey,
    seed: number,
  ): itemKey is WoodItemKey | ScrapItemKey | MetalItemKey {
    const matchesWood = isItemKeyWood(itemKey);
    const matchesScrap = isItemKeyScrap(itemKey);
    const matchesMetal = isItemKeyMetal(itemKey);

    return matchesWood || matchesScrap || matchesMetal;
  },
  createItem(itemKey: ItemKey) {
    if (isItemKeyWood(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 10) * 50 + 100,
        grade: rollOption([
          [50, ItemGrade.COMMON],
          [30, ItemGrade.UNCOMMON],
          [1, ItemGrade.RARE],
        ]),
      });
    }
    if (isItemKeyScrap(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 8) * 50 + 50,
        grade: rollOption([
          [50, ItemGrade.COMMON],
          [30, ItemGrade.UNCOMMON],
          [1, ItemGrade.RARE],
        ]),
      });
    }
    if (isItemKeyMetal(itemKey)) {
      return createItem(itemKey, {
        amount: ~~(Math.random() * 5) * 50 + 50,
        grade: rollOption([
          [50, ItemGrade.COMMON],
          [30, ItemGrade.UNCOMMON],
          [20, ItemGrade.RARE],
        ]),
      });
    }
    throw new Error(`Invalid item key ${itemKey}`);
  },
};
