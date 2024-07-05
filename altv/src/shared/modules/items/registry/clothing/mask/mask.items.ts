import { Item, MaskItemKey, registerItems } from "@shared/modules/items";
const MASK_ITEMS: Record<string, MaskItemInfo> = (await import("./mask.json")).default as any;

export type MaskItem = {
  key: MaskItemKey;

  customName?: string | null;
};

export type MaskItemInfo = {
  key: MaskItemKey;
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

export const masks = registerItems(Object.values(MASK_ITEMS));

/**
 * Type guards for masks
 */
export function isItemKeyMask(key: string): key is MaskItemKey {
  return masks.has(key as MaskItemKey);
}

export function isItemMask(item: Item): item is MaskItem {
  return isItemKeyMask(item.key);
}
