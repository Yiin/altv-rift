import { GlassesItemKey, Item, registerItems } from "@shared/modules/items";
const GLASSES_ITEMS: Record<string, GlassesItemInfo> = (await import("./glasses.json"))
  .default as any;

export type GlassesItem = {
  key: GlassesItemKey;

  customName?: string | null;
};

export type GlassesItemInfo = {
  key: GlassesItemKey;
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

export const glasses = registerItems(Object.values(GLASSES_ITEMS));

/**
 * Type guards for glasses
 */
export function isItemKeyGlasses(key: string): key is GlassesItemKey {
  return glasses.has(key as GlassesItemKey);
}

export function isItemGlasses(item: Item): item is GlassesItem {
  return isItemKeyGlasses(item.key);
}
