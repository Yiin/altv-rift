import { ArmorItemKey, Item, registerItems } from "@shared/modules/items";
const ARMOR_ITEMS: Record<string, ArmorItemInfo> = (await import("./armor.json")).default as any;

export type ArmorItem = {
  key: ArmorItemKey;

  customName?: string | null;
};

export type ArmorItemInfo = {
  key: ArmorItemKey;
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

export const armors = registerItems(Object.values(ARMOR_ITEMS));

/**
 * Type guards for armors
 */
export function isItemKeyArmor(key: string): key is ArmorItemKey {
  return armors.has(key as ArmorItemKey);
}

export function isItemArmor(item: Item): item is ArmorItem {
  return isItemKeyArmor(item.key);
}
