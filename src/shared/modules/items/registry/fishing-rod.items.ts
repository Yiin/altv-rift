import { registerItem } from "@shared/modules/items";
import { Item } from "../types";
import { makeItemKeys } from "../lib/make-item-keys";
import { FishBaitItem } from "./fish-bait.items";

export const FishingRod = makeItemKeys<FishingRodItemKey>()({
  BASIC_FISHING_ROD: "fishingrod",
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

export const fishingRods: Record<FishingRodItemKey, FishingRodItemInfo> = {
  fishingrod: {
    key: "fishingrod",
    name: "Fishing rod",
    description: "A simple rod and reel for catching fish. Ideal for beginners.",
  },
} as Record<FishingRodItemKey, FishingRodItemInfo>;

/**
 * Register all fishing rods.
 */
for (const [key, info] of Object.entries(fishingRods)) {
  registerItem(key as FishingRodItemKey, info);
}

/***
 * Type guards for fishing rods
 */
export function isItemKeyFishingRod(key: string): key is FishingRodItemKey {
  return key in fishingRods;
}

export function isItemFishingRod(item: Item): item is FishingRodItem {
  return isItemKeyFishingRod(item.key);
}
