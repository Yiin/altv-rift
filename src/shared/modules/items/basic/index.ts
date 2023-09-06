import { Item } from "@shared/interfaces";
import { ItemKey } from "../types";
import { tools } from "./tools";
import { fishBaits } from "./fish-bait";

export type BasicItemKey = keyof typeof basics;
export type BasicItemInfo = (typeof basics)[BasicItemKey];

export type BasicItem = {
  key: BasicItemKey;

  amount: number;
};

export const basics = {
  ...tools,
  ...fishBaits,
} as const;

export function isItemKeyBasic(key: ItemKey): key is BasicItemKey {
  return key in basics;
}
export function isItemBasic(item: Item): item is BasicItem {
  return isItemKeyBasic(item.key);
}
