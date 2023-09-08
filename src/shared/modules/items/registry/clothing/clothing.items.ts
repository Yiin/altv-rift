import { Equipment, registerItem } from "@shared/modules/items";
import { Item } from "../../types";

export const Clothing = {
  BOOTS: "boots",
} as const;

export type ClothingItemKey = (typeof Clothing)[keyof typeof Clothing];

export type ClothingItem = {
  key: ClothingItemKey;

  customName?: string | null;
  durability: number;
  texture: number;
};

export type ClothingItemInfo = {
  key: ClothingItemKey;
  name: string;
  description: string;
  equipmentSlot: keyof Equipment;
};

export const clothing: Record<ClothingItemKey, ClothingItemInfo> = {
  boots: {
    key: "boots",
    name: "Boots",
    description: "A pair of boots",
    equipmentSlot: "shoes",
  },
};

/**
 * Register all clothing.
 */
for (const [key, info] of Object.entries(clothing)) {
  registerItem(key as ClothingItemKey, info);
}

export function isItemKeyClothing(key: string): key is ClothingItemKey {
  return key in clothing;
}

export function isItemClothing(item: Item): item is ClothingItem {
  return isItemKeyClothing(item.key);
}
