import { GlovesItemKey, Item, ItemGrade, registerItems } from "@shared/modules/items";
const GLOVES_ITEMS: Record<string, GlovesItemInfo> = (await import("./gloves.json")).default as any;

export type GlovesItem = {
  key: GlovesItemKey;

  customName?: string | null;
  grade: ItemGrade;
};

export type GlovesItemInfo = {
  key: GlovesItemKey;
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

export const gloves = registerItems(Object.values(GLOVES_ITEMS));

/**
 * Type guards for gloves
 */
export function isItemKeyGloves(key: string): key is GlovesItemKey {
  return gloves.has(key as GlovesItemKey);
}

export function isItemGloves(item: Item): item is GlovesItem {
  return isItemKeyGloves(item.key);
}
