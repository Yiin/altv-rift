import { EarringsItemKey, Item, registerItems } from "@shared/modules/items";
const EARRINGS_ITEMS: Record<string, EarringsItemInfo> = (await import("./earrings.json"))
  .default as any;

export type EarringsItem = {
  key: EarringsItemKey;

  customName?: string | null;
};

export type EarringsItemInfo = {
  key: EarringsItemKey;
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

export const earrings = registerItems(Object.values(EARRINGS_ITEMS));

/**
 * Type guards for earrings
 */
export function isItemKeyEarrings(key: string): key is EarringsItemKey {
  return earrings.has(key as EarringsItemKey);
}

export function isItemEarrings(item: Item): item is EarringsItem {
  return isItemKeyEarrings(item.key);
}
