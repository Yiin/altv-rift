import _ from "lodash";
import { AirDropType } from "@shared/modules/air-drops";
import {
  ItemKey,
  ClothingItemKey,
  isItemKeyClothing,
  getItemTier,
  ItemTier,
  createItem,
} from "@shared/modules/items";
import { rollOption } from "@shared/utility/random";
import { LootTable } from "../loot.types";

export const CLOTHING_LOW: LootTable = {
  key: "clothing-low",
  type: AirDropType.Clothing,
  score: 1,
  getItemsAmount() {
    return _.random(10, 15);
  },
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is ClothingItemKey {
    return (
      isItemKeyClothing(itemKey) &&
      getItemTier(itemKey) ===
      rollOption(
        [
          [50, ItemTier.F],
          [30, ItemTier.E],
          [20, ItemTier.D],
        ],
        seed,
      )
    );
  },
  createItem,
};
