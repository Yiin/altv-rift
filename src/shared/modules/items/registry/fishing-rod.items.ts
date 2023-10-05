import { registerItem } from "@shared/modules/items";
import { Item } from "../types";
import { makeKeys } from "../../../utility/make-keys";
import { FishBaitItem } from "./fish-bait.items";

export const FishingRod = makeKeys<FishingRodItemKey>()({
  BASIC_FISHING_ROD: "basic_fishingrod",
  ADVANCED_FISHING_ROD: "advanced_fishingrod",
  EXPERT_FISHING_ROD: "expert_fishingrod",
  ELITE_FISHING_ROD: "elite_fishingrod",
  EPIC_FISHING_ROD: "epic_fishingrod",
});

export type FishingRodItemKey = Brand<string, "FishingRodItemKey">;

export type FishingRodItem = {
  key: FishingRodItemKey;
  bait?: FishBaitItem | null;
};

export type FishingRodItemInfo = {
  key: FishingRodItemKey;
  name: string;
  description: string;
};

export const fishingRods: FishingRodItemInfo[] = [
  {
    key: FishingRod.BASIC_FISHING_ROD,
    name: "Basic Fishing Rod",
    description: "A simple rod and reel for catching fish. Ideal for beginners.",
  },
  {
    key: FishingRod.ADVANCED_FISHING_ROD,
    name: "Advanced Fishing Rod",
    description:
      "Enhanced with a more responsive reel and a flexible rod, this tool improves casting distance and accuracy. Great for avid anglers.",
  },
  {
    key: FishingRod.EXPERT_FISHING_ROD,
    name: "Master Fishing Rod",
    description:
      "Meticulously crafted, this rod boasts superior sensitivity and balance, allowing for the detection of even the slightest bite. A favorite among fishing enthusiasts.",
  },
  {
    key: FishingRod.ELITE_FISHING_ROD,
    name: "Elite Fishing Rod",
    description:
      "The pinnacle of angling craftsmanship, this rod ensures unmatched precision and control, making every catch a memorable experience.",
  },
  {
    key: FishingRod.EPIC_FISHING_ROD,
    name: "Epic Fishing Rod",
    description:
      "Legend speaks of this rod's unparalleled prowess. Crafted from the finest materials, it promises an epic fishing adventure like no other.",
  },
];

/**
 * Register all fishing rods.
 */
for (const info of fishingRods) {
  registerItem(info);
}

/***
 * Type guards for fishing rods
 */
export function isItemKeyFishingRod(key: string): key is FishingRodItemKey {
  return fishingRods.some((rod) => rod.key === key);
}

export function isItemFishingRod(item: Item): item is FishingRodItem {
  return isItemKeyFishingRod(item.key);
}
