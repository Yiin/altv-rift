import { registerItems } from "../items-registry";
import { makeKeys } from "../../../utility/make-keys";
import { Item } from "../types";
import { FoodIngredient } from "./materials/food-ingredient.items";

export const FishingBait = makeKeys<FishingBaitItemKey>()({
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
});

export type FishingBaitItemKey = Brand<string, "FishingBaitItemKey">;

export type FishingBaitItem = {
  key: FishingBaitItemKey;
  amount: number;
};

export type FishingBaitItemInfo = {
  key: FishingBaitItemKey;
  name: string;
  description: string;
  chance: number;
};

export const fishingBaits = registerItems<FishingBaitItemInfo>([
  {
    key: FishingBait.WORMS,
    name: "Worms",
    description: "Common bait for freshwater fishing.",
    chance: 1,
  },
  {
    key: FishingBait.ROE,
    name: "Fish Roe",
    description: "Fish eggs ideal for catching salmon.",
    chance: 1 / 5,
  },
  {
    key: FishingBait.CRAWFISH,
    name: "Crawfish",
    description: "Good for luring bass.",
    chance: 1 / 10,
  },
  {
    key: FishingBait.CHICKEN_LIVER,
    name: "Chicken Liver",
    description: "Effective bait for catfish.",
    chance: 1 / 15,
  },
  {
    key: FishingBait.MINNOWS,
    name: "Minnows",
    description: "Small fish that attract bigger fish like pike.",
    chance: 1 / 20,
  },
  {
    key: FishingBait.SQUID,
    name: "Squid",
    description: "Saltwater bait for tuna.",
    chance: 1 / 30,
  },
  {
    key: FishingBait.CUT_MACKEREL,
    name: "Cut Mackerel",
    description: "Great for catching mackerel and other saltwater fish.",
    chance: 1 / 40,
  },
  {
    key: FishingBait.SWEET_CORN,
    name: "Sweet Corn",
    description: "Attracts carp.",
    chance: 1 / 50,
  },
  {
    key: FishingBait.SHRIMP,
    name: "Shrimp",
    description: "Good for red snapper.",
    chance: 1 / 60,
  },
  {
    key: FishingBait.MACKEREL_STEAK,
    name: "Mackerel Steak",
    description: "Effective bait for swordfish.",
    chance: 1 / 70,
  },
  {
    key: FishingBait.CRAB_MEAT,
    name: "Crab Meat",
    description: "Effective for catching extreme sea creatures like octopus.",
    chance: 1 / 80,
  },
  {
    key: FishingBait.FROGS,
    name: "Frogs",
    description: "Ideal for luring electric eels.",
    chance: 1 / 90,
  },
  {
    key: FishingBait.TUNA_HEAD,
    name: "Tuna Head",
    description: "Perfect for catching hammerhead sharks.",
    chance: 1 / 100,
  },
  {
    key: FishingBait.SMALL_FISH_BUNDLE,
    name: "Small Fish Bundle",
    description: "A bundle of small fish, used to catch giant squids.",
    chance: 1 / 125,
  },
  {
    key: FishingBait.GOLDEN_WORMS,
    name: "Golden Worms",
    description: "Rare bait used to catch the mythical Golden Koi.",
    chance: 1 / 150,
  },
]);

export function isItemKeyFishingBait(key: string): key is FishingBaitItemKey {
  return fishingBaits.has(key as FishingBaitItemKey);
}

export function isItemFishingBait(item: Item): item is FishingBaitItem {
  return isItemKeyFishingBait(item.key);
}

export function getBaitChance(bait: FishingBaitItemKey): number {
  return fishingBaits.get(bait)?.chance ?? 0;
}

export const BAIT_TO_FISH_MAP = new Map([
  [FishingBait.WORMS, [FoodIngredient.RAW_TROUT]],
  [FishingBait.ROE, [FoodIngredient.RAW_SALMON]],
  [FishingBait.CRAWFISH, [FoodIngredient.RAW_BASS]],
  [FishingBait.CHICKEN_LIVER, [FoodIngredient.RAW_CATFISH]],
  [FishingBait.MINNOWS, [FoodIngredient.RAW_PIKE]],
  [FishingBait.SQUID, [FoodIngredient.RAW_TUNA]],
  [FishingBait.CUT_MACKEREL, [FoodIngredient.RAW_MACKEREL]],
  [FishingBait.SWEET_CORN, [FoodIngredient.RAW_CARP]],
  [FishingBait.SHRIMP, [FoodIngredient.RAW_RED_SNAPPER]],
  [FishingBait.MACKEREL_STEAK, [FoodIngredient.RAW_SWORDFISH]],
  [FishingBait.CRAB_MEAT, [FoodIngredient.RAW_OCTOPUS]],
  [FishingBait.FROGS, [FoodIngredient.RAW_ELECTRIC_EEL]],
  [FishingBait.TUNA_HEAD, [FoodIngredient.RAW_SHARK]],
  [FishingBait.SMALL_FISH_BUNDLE, [FoodIngredient.RAW_GIANT_SQUID]],
  [FishingBait.GOLDEN_WORMS, [FoodIngredient.RAW_GOLDEN_KOI]],
]);
