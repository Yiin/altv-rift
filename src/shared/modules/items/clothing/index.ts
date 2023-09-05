import { ItemType } from "@prisma/client/edge";
import { ClothingItem, Equipment, Item } from "@shared/interfaces";

export const Clothing = {
  BOOTS: "boots",
} as const;

export type ClothingItemKey = (typeof Clothing)[keyof typeof Clothing];

export type ClothingItemInfo = {
  key: ClothingItemKey;
  itemType: typeof ItemType.CLOTHING;
  name: string;
  description: string;
  equipmentSlot: keyof Equipment;
};

export const clothing: Record<ClothingItemKey, ClothingItemInfo> = {
  boots: {
    key: "boots",
    itemType: ItemType.CLOTHING,
    name: "Boots",
    description: "A pair of boots",
    equipmentSlot: "shoes",
  },
};

export function isItemKeyClothing(key: string): key is ClothingItemKey {
  return key in clothing;
}

export function isItemClothing(item: Item): item is ClothingItem {
  return isItemKeyClothing(item.key);
}
