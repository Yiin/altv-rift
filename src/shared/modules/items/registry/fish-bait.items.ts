import { registerItem } from "../items-registry";
import { Item } from "../types";
import { FoodIngredient } from "./materials/food-ingredient.items";

export const FishBait = {
  WORMS: "worms",
  ROE: "roe",
  CRAWFISH: "crawfish",
  CHICKEN_LIVER: "chickenliver",
  MINNOWS: "minnows",
  SQUID: "squid",
  CUT_MACKEREL: "cutmackerel",
  SWEET_CORN: "sweetcorn",
  SHRIMP: "shrimp",
  MACKEREL_STEAK: "mackerelsteak",
  CRAB_MEAT: "crabmeat",
  FROGS: "frogs",
  TUNA_HEAD: "tunahead",
  SMALL_FISH_BUNDLE: "smallfishbundle",
  GOLDEN_WORMS: "goldenworms",
} as const;

export type FishBaitItemKey = (typeof FishBait)[keyof typeof FishBait];

export type FishBaitItem = {
  key: FishBaitItemKey;
  amount: number;
};

export type FishBaitItemInfo = {
  key: FishBaitItemKey;
  name: string;
  description: string;
};

export const fishBaits: Record<FishBaitItemKey, FishBaitItemInfo> = {
  worms: {
    key: "worms",
    name: "Worms",
    description: "Common bait for freshwater fishing.",
  },
  roe: {
    key: "roe",
    name: "Fish Roe",
    description: "Fish eggs ideal for catching salmon.",
  },
  crawfish: {
    key: "crawfish",
    name: "Crawfish",
    description: "Good for luring bass.",
  },
  chickenliver: {
    key: "chickenliver",
    name: "Chicken Liver",
    description: "Effective bait for catfish.",
  },
  minnows: {
    key: "minnows",
    name: "Minnows",
    description: "Small fish that attract bigger fish like pike.",
  },
  squid: {
    key: "squid",
    name: "Squid",
    description: "Saltwater bait for tuna.",
  },
  cutmackerel: {
    key: "cutmackerel",
    name: "Cut Mackerel",
    description: "Great for catching mackerel and other saltwater fish.",
  },
  sweetcorn: {
    key: "sweetcorn",
    name: "Sweet Corn",
    description: "Attracts carp.",
  },
  shrimp: {
    key: "shrimp",
    name: "Shrimp",
    description: "Good for red snapper.",
  },
  mackerelsteak: {
    key: "mackerelsteak",
    name: "Mackerel Steak",
    description: "Effective bait for swordfish.",
  },
  crabmeat: {
    key: "crabmeat",
    name: "Crab Meat",
    description: "Effective for catching extreme sea creatures like octopus.",
  },
  frogs: {
    key: "frogs",
    name: "Frogs",
    description: "Ideal for luring electric eels.",
  },
  tunahead: {
    key: "tunahead",
    name: "Tuna Head",
    description: "Perfect for catching hammerhead sharks.",
  },
  smallfishbundle: {
    key: "smallfishbundle",
    name: "Small Fish Bundle",
    description: "A bundle of small fish, used to catch giant squids.",
  },
  goldenworms: {
    key: "goldenworms",
    name: "Golden Worms",
    description: "Rare bait used to catch the mythical Golden Koi.",
  },
};

/**
 * Register all fish baits.
 */
for (const [key, value] of Object.entries(fishBaits)) {
  registerItem(key as FishBaitItemKey, value);
}

export function isItemKeyFishBait(key: string): key is FishBaitItemKey {
  return key in fishBaits;
}

export function isItemFishBait(item: Item): item is FishBaitItem {
  return isItemKeyFishBait(item.key);
}

export const BAIT_TO_FISH_MAP = new Map([
  [FishBait.WORMS, [FoodIngredient.RAW_TROUT]],
  [FishBait.ROE, [FoodIngredient.RAW_SALMON]],
  [FishBait.CRAWFISH, [FoodIngredient.RAW_BASS]],
  [FishBait.CHICKEN_LIVER, [FoodIngredient.RAW_CATFISH]],
  [FishBait.MINNOWS, [FoodIngredient.RAW_PIKE]],
  [FishBait.SQUID, [FoodIngredient.RAW_TUNA]],
  [FishBait.CUT_MACKEREL, [FoodIngredient.RAW_MACKEREL]],
  [FishBait.SWEET_CORN, [FoodIngredient.RAW_CARP]],
  [FishBait.SHRIMP, [FoodIngredient.RAW_RED_SNAPPER]],
  [FishBait.MACKEREL_STEAK, [FoodIngredient.RAW_SWORDFISH]],
  [FishBait.CRAB_MEAT, [FoodIngredient.RAW_OCTOPUS]],
  [FishBait.FROGS, [FoodIngredient.RAW_ELECTRIC_EEL]],
  [FishBait.TUNA_HEAD, [FoodIngredient.RAW_HAMMERHEAD_SHARK]],
  [FishBait.SMALL_FISH_BUNDLE, [FoodIngredient.RAW_GIANT_SQUID]],
  [FishBait.GOLDEN_WORMS, [FoodIngredient.RAW_GOLDEN_KOI]],
]);
