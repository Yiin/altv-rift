import { ItemType } from "@prisma/client/edge";
import { FoodIngredient } from "../materials/food-ingredients";

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

export type FishBaitItemInfo = {
  key: FishBaitItemKey;
  itemType: typeof ItemType.BASIC;
  name: string;
  description: string;
};

export const fishBaits: Record<FishBaitItemKey, FishBaitItemInfo> = {
  worms: {
    key: "worms",
    itemType: ItemType.BASIC,
    name: "Worms",
    description: "Common bait for freshwater fishing.",
  },
  roe: {
    key: "roe",
    itemType: ItemType.BASIC,
    name: "Fish Roe",
    description: "Fish eggs ideal for catching salmon.",
  },
  crawfish: {
    key: "crawfish",
    itemType: ItemType.BASIC,
    name: "Crawfish",
    description: "Good for luring bass.",
  },
  chickenliver: {
    key: "chickenliver",
    itemType: ItemType.BASIC,
    name: "Chicken Liver",
    description: "Effective bait for catfish.",
  },
  minnows: {
    key: "minnows",
    itemType: ItemType.BASIC,
    name: "Minnows",
    description: "Small fish that attract bigger fish like pike.",
  },
  squid: {
    key: "squid",
    itemType: ItemType.BASIC,
    name: "Squid",
    description: "Saltwater bait for tuna.",
  },
  cutmackerel: {
    key: "cutmackerel",
    itemType: ItemType.BASIC,
    name: "Cut Mackerel",
    description: "Great for catching mackerel and other saltwater fish.",
  },
  sweetcorn: {
    key: "sweetcorn",
    itemType: ItemType.BASIC,
    name: "Sweet Corn",
    description: "Attracts carp.",
  },
  shrimp: {
    key: "shrimp",
    itemType: ItemType.BASIC,
    name: "Shrimp",
    description: "Good for red snapper.",
  },
  mackerelsteak: {
    key: "mackerelsteak",
    itemType: ItemType.BASIC,
    name: "Mackerel Steak",
    description: "Effective bait for swordfish.",
  },
  crabmeat: {
    key: "crabmeat",
    itemType: ItemType.BASIC,
    name: "Crab Meat",
    description: "Effective for catching extreme sea creatures like octopus.",
  },
  frogs: {
    key: "frogs",
    itemType: ItemType.BASIC,
    name: "Frogs",
    description: "Ideal for luring electric eels.",
  },
  tunahead: {
    key: "tunahead",
    itemType: ItemType.BASIC,
    name: "Tuna Head",
    description: "Perfect for catching hammerhead sharks.",
  },
  smallfishbundle: {
    key: "smallfishbundle",
    itemType: ItemType.BASIC,
    name: "Small Fish Bundle",
    description: "A bundle of small fish, used to catch giant squids.",
  },
  goldenworms: {
    key: "goldenworms",
    itemType: ItemType.BASIC,
    name: "Golden Worms",
    description: "Rare bait used to catch the mythical Golden Koi.",
  },
};

export function isItemKeyFishBait(key: string): key is FishBaitItemKey {
  return key in fishBaits;
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
