import { registerItems } from "../items-registry";
import { makeKeys } from "../../../utility/make-keys";
import { Item } from "../types";
import { ItemFlags } from "../enums";
import { FoodIngredient } from "./materials/food-ingredient.items";

export const FishBait = makeKeys<FishBaitItemKey>()({
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

export type FishBaitItemKey = Brand<string, "FishBaitItemKey">;

export type FishBaitItem = {
  key: FishBaitItemKey;
  amount: number;
};

export type FishBaitItemInfo = {
  key: FishBaitItemKey;
  name: string;
  description: string;
  chance: number;
};

export const fishBaits = registerItems<FishBaitItemInfo>([
  {
    key: FishBait.WORMS,
    name: "Worms",
    description: "Common bait for freshwater fishing.",
    chance: 1,
  },
  {
    key: FishBait.ROE,
    name: "Fish Roe",
    description: "Fish eggs ideal for catching salmon.",
    chance: 1 / 5,
  },
  {
    key: FishBait.CRAWFISH,
    name: "Crawfish",
    description: "Good for luring bass.",
    chance: 1 / 10,
  },
  {
    key: FishBait.CHICKEN_LIVER,
    name: "Chicken Liver",
    description: "Effective bait for catfish.",
    chance: 1 / 15,
  },
  {
    key: FishBait.MINNOWS,
    name: "Minnows",
    description: "Small fish that attract bigger fish like pike.",
    chance: 1 / 20,
  },
  {
    key: FishBait.SQUID,
    name: "Squid",
    description: "Saltwater bait for tuna.",
    chance: 1 / 30,
  },
  {
    key: FishBait.CUT_MACKEREL,
    name: "Cut Mackerel",
    description: "Great for catching mackerel and other saltwater fish.",
    chance: 1 / 40,
  },
  {
    key: FishBait.SWEET_CORN,
    name: "Sweet Corn",
    description: "Attracts carp.",
    chance: 1 / 50,
  },
  {
    key: FishBait.SHRIMP,
    name: "Shrimp",
    description: "Good for red snapper.",
    chance: 1 / 60,
  },
  {
    key: FishBait.MACKEREL_STEAK,
    name: "Mackerel Steak",
    description: "Effective bait for swordfish.",
    chance: 1 / 70,
  },
  {
    key: FishBait.CRAB_MEAT,
    name: "Crab Meat",
    description: "Effective for catching extreme sea creatures like octopus.",
    chance: 1 / 80,
  },
  {
    key: FishBait.FROGS,
    name: "Frogs",
    description: "Ideal for luring electric eels.",
    chance: 1 / 90,
  },
  {
    key: FishBait.TUNA_HEAD,
    name: "Tuna Head",
    description: "Perfect for catching hammerhead sharks.",
    chance: 1 / 100,
  },
  {
    key: FishBait.SMALL_FISH_BUNDLE,
    name: "Small Fish Bundle",
    description: "A bundle of small fish, used to catch giant squids.",
    chance: 1 / 125,
  },
  {
    key: FishBait.GOLDEN_WORMS,
    name: "Golden Worms",
    description: "Rare bait used to catch the mythical Golden Koi.",
    chance: 1 / 150,
  },
]);

export function isItemKeyFishBait(key: string): key is FishBaitItemKey {
  return fishBaits.has(key as FishBaitItemKey);
}

export function isItemFishBait(item: Item): item is FishBaitItem {
  return isItemKeyFishBait(item.key);
}

export function getBaitChance(bait: FishBaitItemKey): number {
  return fishBaits.get(bait)?.chance ?? 0;
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
