import { Item, ItemGrade, LeftHandItemKey, registerItems } from "@shared/modules/items";
const LEFTHAND_ITEMS: Record<string, LeftHandItemInfo> = (await import("./lefthand.json"))
  .default as any;

export type LeftHandItem = {
  key: LeftHandItemKey;

  customName?: string | null;
};

export type LeftHandItemInfo = {
  key: LeftHandItemKey;
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

export const lefthand = registerItems(Object.values(LEFTHAND_ITEMS));

/**
 * Type guards for left hand items
 */
export function isItemKeyLeftHand(key: string): key is LeftHandItemKey {
  return lefthand.has(key as LeftHandItemKey);
}

export function isItemLeftHand(item: Item): item is LeftHandItem {
  return isItemKeyLeftHand(item.key);
}
