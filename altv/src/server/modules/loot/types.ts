import { AirDropType } from "@shared/modules/air-drops";
import { Item, ItemKey } from "@shared/modules/items";

export type LootTable = {
  key: string;
  type?: AirDropType;
  score: number;
  getItemsAmount(): number;
  filterItemKey(itemKey: ItemKey, seed: number): itemKey is ItemKey;
  createItem(itemKey: ItemKey): Item;
};
