import { GlovesItemKey, Item, registerItems, gloves } from "@shared/modules/items";
import { TopItemKey } from "./top.keys";
const TOP_ITEMS: Record<string, TopItemInfo> = (await import("./top.json")).default as any;

export type TopItem = {
  key: TopItemKey;

  customName?: string | null;
};

export type TopItemInfo = {
  key: TopItemKey;
  ped: string;
  dlc: string;
  dlcDrawableId: number;
  componentId: number;
  drawableId: number;
  textureId: number;
  name: string;
  price: number;
  torsos: Partial<GlovesItemKey[]> | null; // 0-16
  // gloves: string[] | null; // all the other torsos that have gloves on hands
  restrictionTags: string[] | null;
};

export const tops = registerItems(Object.values(TOP_ITEMS).map(top => ({
  ...top,
  // for context, torsos are gloves
  // we get glove drawableIds from top.torsos array, but
  // we need glove keys instead:
  torsos: [...gloves.values()].filter(({ drawableId }) => top.torsos?.includes(drawableId)).map(({ key }) => key) ?? null,
})));

/**
 * Type guards for tops
 */
export function isItemKeyTop(key: string): key is TopItemKey {
  return tops.has(key as TopItemKey);
}

export function isItemTop(item: Item): item is TopItem {
  return isItemKeyTop(item.key);
}
