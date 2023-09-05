import { ItemType } from "@prisma/client/edge";

export const FoodIngredient = {
  RAW_TROUT: "rawtrout",
  RAW_SALMON: "rawsalmon",
  RAW_BASS: "rawbass",
  RAW_CATFISH: "rawcatfish",
  RAW_PIKE: "rawpike",
  RAW_TUNA: "rawtuna",
  RAW_MACKEREL: "rawmackerel",
  RAW_CARP: "rawcarp",
  RAW_RED_SNAPPER: "rawredsnapper",
  RAW_SWORDFISH: "rawswordfish",
  RAW_OCTOPUS: "rawoctopus",
  RAW_ELECTRIC_EEL: "rawelectriceel",
  RAW_HAMMERHEAD_SHARK: "rawhammerheadshark",
  RAW_GIANT_SQUID: "rawgiantsquid",
  RAW_GOLDEN_KOI: "rawgoldenkoi",
} as const;

export type FoodIngredientItemKey = (typeof FoodIngredient)[keyof typeof FoodIngredient];

export type FoodIngredientItemInfo = {
  key: FoodIngredientItemKey;
  itemType: typeof ItemType.MATERIAL;
  name: string;
  description: string;
};

export const foodIngredients: Record<FoodIngredientItemKey, FoodIngredientItemInfo> = {
  rawtrout: {
    key: "rawtrout",
    itemType: ItemType.MATERIAL,
    name: "Raw Trout",
    description: "Raw fish, should be cooked before consuming.",
  },
  rawsalmon: {
    key: "rawsalmon",
    itemType: ItemType.MATERIAL,
    name: "Raw Salmon",
    description: "High in nutrients but best when cooked.",
  },
  rawbass: {
    key: "rawbass",
    itemType: ItemType.MATERIAL,
    name: "Raw Bass",
    description: "Raw and should be cooked.",
  },
  rawcatfish: {
    key: "rawcatfish",
    itemType: ItemType.MATERIAL,
    name: "Raw Catfish",
    description: "Raw and muddy, cook before eating.",
  },
  rawpike: {
    key: "rawpike",
    itemType: ItemType.MATERIAL,
    name: "Raw Pike",
    description: "A predatory freshwater fish. Best cooked before eating.",
  },
  rawtuna: {
    key: "rawtuna",
    itemType: ItemType.MATERIAL,
    name: "Raw Tuna",
    description: "High-quality fish, often used in sushi.",
  },
  rawmackerel: {
    key: "rawmackerel",
    itemType: ItemType.MATERIAL,
    name: "Raw Mackerel",
    description: "Oily fish that's rich in Omega-3. Best when cooked.",
  },
  rawcarp: {
    key: "rawcarp",
    itemType: ItemType.MATERIAL,
    name: "Raw Carp",
    description: "Common freshwater fish. Should be cooked.",
  },
  rawredsnapper: {
    key: "rawredsnapper",
    itemType: ItemType.MATERIAL,
    name: "Raw Red Snapper",
    description: "Popular saltwater fish, better when cooked.",
  },
  rawswordfish: {
    key: "rawswordfish",
    itemType: ItemType.MATERIAL,
    name: "Raw Swordfish",
    description: "A large, meaty fish. Cook before eating.",
  },
  rawoctopus: {
    key: "rawoctopus",
    itemType: ItemType.MATERIAL,
    name: "Raw Octopus",
    description: "An eight-armed sea creature. Cook to unlock its flavors.",
  },
  rawelectriceel: {
    key: "rawelectriceel",
    itemType: ItemType.MATERIAL,
    name: "Raw Electric Eel",
    description: "Handle with care. Requires cooking.",
  },
  rawhammerheadshark: {
    key: "rawhammerheadshark",
    itemType: ItemType.MATERIAL,
    name: "Raw Hammerhead Shark",
    description: "A large predatory fish. Cook before consuming.",
  },
  rawgiantsquid: {
    key: "rawgiantsquid",
    itemType: ItemType.MATERIAL,
    name: "Raw Giant Squid",
    description: "A deep-sea delicacy. Must be cooked.",
  },
  rawgoldenkoi: {
    key: "rawgoldenkoi",
    itemType: ItemType.MATERIAL,
    name: "Raw Golden Koi",
    description: "A mythical fish, beautiful and rare.",
  },
};

export function isItemKeyFoodIngredient(key: string): key is FoodIngredientItemKey {
  return key in foodIngredients;
}
