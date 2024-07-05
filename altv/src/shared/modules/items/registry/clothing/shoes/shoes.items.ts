import { Item, registerItems } from "@shared/modules/items";
import { ShoesItemKey } from "./shoes.keys";
const SHOES_ITEMS: Record<string, ShoesItemInfo> = (await import("./shoes.json")).default as any;

export type ShoesItem = {
  key: ShoesItemKey;

  customName?: string | null;
};

export type ShoesItemInfo = {
  key: ShoesItemKey;
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

export const shoes = registerItems(Object.values(SHOES_ITEMS));

/**
 * Type guards for shoes
 */
export function isItemKeyShoes(key: string): key is ShoesItemKey {
  return shoes.has(key as ShoesItemKey);
}

export function isItemShoes(item: Item): item is ShoesItem {
  return isItemKeyShoes(item.key);
}
