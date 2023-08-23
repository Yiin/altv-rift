import { ItemType } from "@prisma/client";
import { Equipment } from "@shared/interfaces";

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
