import { registerItem } from "../../items-registry";

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
  name: string;
  description: string;
};

export const foodIngredients: Record<FoodIngredientItemKey, FoodIngredientItemInfo> = {
  rawtrout: {
    key: "rawtrout",
    name: "Raw Trout",
    description: "Raw fish, should be cooked before consuming.",
  },
  rawsalmon: {
    key: "rawsalmon",
    name: "Raw Salmon",
    description: "High in nutrients but best when cooked.",
  },
  rawbass: {
    key: "rawbass",
    name: "Raw Bass",
    description: "Raw and should be cooked.",
  },
  rawcatfish: {
    key: "rawcatfish",
    name: "Raw Catfish",
    description: "Raw and muddy, cook before eating.",
  },
  rawpike: {
    key: "rawpike",
    name: "Raw Pike",
    description: "A predatory freshwater fish. Best cooked before eating.",
  },
  rawtuna: {
    key: "rawtuna",
    name: "Raw Tuna",
    description: "High-quality fish, often used in sushi.",
  },
  rawmackerel: {
    key: "rawmackerel",
    name: "Raw Mackerel",
    description: "Oily fish that's rich in Omega-3. Best when cooked.",
  },
  rawcarp: {
    key: "rawcarp",
    name: "Raw Carp",
    description: "Common freshwater fish. Should be cooked.",
  },
  rawredsnapper: {
    key: "rawredsnapper",
    name: "Raw Red Snapper",
    description: "Popular saltwater fish, better when cooked.",
  },
  rawswordfish: {
    key: "rawswordfish",
    name: "Raw Swordfish",
    description: "A large, meaty fish. Cook before eating.",
  },
  rawoctopus: {
    key: "rawoctopus",
    name: "Raw Octopus",
    description: "An eight-armed sea creature. Cook to unlock its flavors.",
  },
  rawelectriceel: {
    key: "rawelectriceel",
    name: "Raw Electric Eel",
    description: "Handle with care. Requires cooking.",
  },
  rawhammerheadshark: {
    key: "rawhammerheadshark",
    name: "Raw Hammerhead Shark",
    description: "A large predatory fish. Cook before consuming.",
  },
  rawgiantsquid: {
    key: "rawgiantsquid",
    name: "Raw Giant Squid",
    description: "A deep-sea delicacy. Must be cooked.",
  },
  rawgoldenkoi: {
    key: "rawgoldenkoi",
    name: "Raw Golden Koi",
    description: "A mythical fish, beautiful and rare.",
  },
};

/**
 * Register all food ingredients.
 */
for (const [key, info] of Object.entries(foodIngredients)) {
  registerItem(key as FoodIngredientItemKey, info);
}

export function isItemKeyFoodIngredient(key: string): key is FoodIngredientItemKey {
  return key in foodIngredients;
}
