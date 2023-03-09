import { ItemType } from "./item-types";

export const clothing = {
  boots: {
    key: "boots",
    itemType: ItemType.CLOTHING,
    name: "Boots",
    description: "A pair of boots",
  },
} as const;

export type ClothingItemKey = keyof typeof clothing;
