import { GlovesItemKey, Item, registerItems } from "@shared/modules/items";
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
  torsos: Partial<GlovesItemKey[]> | null;
  gloves: string[] | null;
  restrictionTags: string[] | null;
};

export const tops = registerItems(Object.values(TOP_ITEMS));

/**
 * Type guards for tops
 */
export function isItemKeyTop(key: string): key is TopItemKey {
  return tops.has(key as TopItemKey);
}

export function isItemTop(item: Item): item is TopItem {
  return isItemKeyTop(item.key);
}
