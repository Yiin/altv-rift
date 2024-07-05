import { HeadwearItemKey, Item, ItemGrade, registerItems } from "@shared/modules/items";
const HEADWEAR_ITEMS: Record<string, HeadwearItemInfo> = (await import("./headwear.json"))
  .default as any;

export type HeadwearItem = {
  key: HeadwearItemKey;

  customName?: string | null;
  grade: ItemGrade;
};

export type HeadwearItemInfo = {
  key: HeadwearItemKey;
  ped: string;
  dlc: string;
  dlcDrawableId: number;
  componentId: number;
  drawableId: number;
  textureId: number;
  name: string;
  price: number;
  restrictionTags: string[] | null;
};

export const headwears = registerItems(Object.values(HEADWEAR_ITEMS));

/**
 * Type guards for headwears
 */
export function isItemKeyHeadwear(key: string): key is HeadwearItemKey {
  return headwears.has(key as HeadwearItemKey);
}

export function isItemHeadwear(item: Item): item is HeadwearItem {
  return isItemKeyHeadwear(item.key);
}
