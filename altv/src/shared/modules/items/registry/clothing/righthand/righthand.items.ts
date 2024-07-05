import { Item, registerItems } from "@shared/modules/items";
import { RightHandItemKey } from "./righthand.keys";
const RIGHTHAND_ITEMS: Record<string, RightHandItemInfo> = (await import("./righthand.json"))
  .default as any;

export type RightHandItem = {
  key: RightHandItemKey;

  customName?: string | null;
};

export type RightHandItemInfo = {
  key: RightHandItemKey;
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

export const righthand = registerItems(Object.values(RIGHTHAND_ITEMS));

/**
 * Type guards for right hand items
 */
export function isItemKeyRightHand(key: string): key is RightHandItemKey {
  return righthand.has(key as RightHandItemKey);
}

export function isItemRightHand(item: Item): item is RightHandItem {
  return isItemKeyRightHand(item.key);
}
