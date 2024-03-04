import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";

export const FoodIngredient = makeKeys<FoodIngredientItemKey>()({
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
});

export type FoodIngredientItemKey = Brand<string, "FoodIngredientItemKey">;

export type FoodIngredientItem = {
  key: FoodIngredientItemKey;
  amount: number;
};

export type FoodIngredientItemInfo = {
  key: FoodIngredientItemKey;
  name: string;
  description: string;
};

export const foodIngredients = registerItems<FoodIngredientItemInfo>([
  {
    key: FoodIngredient.RAW_TROUT,
    name: "Raw Trout",
    description: "Raw fish, should be cooked before consuming.",
  },
  {
    key: FoodIngredient.RAW_SALMON,
    name: "Raw Salmon",
    description: "High in nutrients but best when cooked.",
  },
  {
    key: FoodIngredient.RAW_BASS,
    name: "Raw Bass",
    description: "Raw and should be cooked.",
  },
  {
    key: FoodIngredient.RAW_CATFISH,
    name: "Raw Catfish",
    description: "Raw and muddy, cook before eating.",
  },
  {
    key: FoodIngredient.RAW_PIKE,
    name: "Raw Pike",
    description: "A predatory freshwater fish. Best cooked before eating.",
  },
  {
    key: FoodIngredient.RAW_TUNA,
    name: "Raw Tuna",
    description: "High-quality fish, often used in sushi.",
  },
  {
    key: FoodIngredient.RAW_MACKEREL,
    name: "Raw Mackerel",
    description: "Oily fish that's rich in Omega-3. Best when cooked.",
  },
  {
    key: FoodIngredient.RAW_CARP,
    name: "Raw Carp",
    description: "Common freshwater fish. Should be cooked.",
  },
  {
    key: FoodIngredient.RAW_RED_SNAPPER,
    name: "Raw Red Snapper",
    description: "Popular saltwater fish, better when cooked.",
  },
  {
    key: FoodIngredient.RAW_SWORDFISH,
    name: "Raw Swordfish",
    description: "A large, meaty fish. Cook before eating.",
  },
  {
    key: FoodIngredient.RAW_OCTOPUS,
    name: "Raw Octopus",
    description: "An eight-armed sea creature. Cook to unlock its flavors.",
  },
  {
    key: FoodIngredient.RAW_ELECTRIC_EEL,
    name: "Raw Electric Eel",
    description: "Handle with care. Requires cooking.",
  },
  {
    key: FoodIngredient.RAW_HAMMERHEAD_SHARK,
    name: "Raw Hammerhead Shark",
    description: "A large predatory fish. Cook before consuming.",
  },
  {
    key: FoodIngredient.RAW_GIANT_SQUID,
    name: "Raw Giant Squid",
    description: "A deep-sea delicacy. Must be cooked.",
  },
  {
    key: FoodIngredient.RAW_GOLDEN_KOI,
    name: "Raw Golden Koi",
    description: "A mythical fish, beautiful and rare.",
  },
]);

export function isItemKeyFoodIngredient(key: string): key is FoodIngredientItemKey {
  return foodIngredients.has(key as FoodIngredientItemKey);
}
