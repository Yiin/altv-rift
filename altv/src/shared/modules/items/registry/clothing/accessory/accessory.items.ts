import { AccessoryItemKey, Item, registerItems } from "@shared/modules/items";
const ACCESSORY_ITEMS: Record<string, AccessoryItemInfo> = (await import("./accessory.json"))
  .default as any;

export type AccessoryItem = {
  key: AccessoryItemKey;

  customName?: string | null;
};

export type AccessoryItemInfo = {
  key: AccessoryItemKey;
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

export const accessories = registerItems(Object.values(ACCESSORY_ITEMS));

/**
 * Type guards for accessories
 */
export function isItemKeyAccessory(key: string): key is AccessoryItemKey {
  return accessories.has(key as AccessoryItemKey);
}

export function isItemAccessory(item: Item): item is AccessoryItem {
  return isItemKeyAccessory(item.key);
}
