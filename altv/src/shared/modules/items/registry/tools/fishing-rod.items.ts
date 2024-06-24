import { FishingBaitItem, Item, ItemGrade, registerItems } from "@shared/modules/items";
import { makeKeys } from "@shared/utility/make-keys";

export const FishingRod = makeKeys<FishingRodItemKey>()({
  FISHING_ROD: "fishingrod",
});

export type FishingRodItemKey = Brand<string, "FishingRodItemKey">;

export type FishingRodItem = {
  key: FishingRodItemKey;
  bait?: FishingBaitItem | null;
  grade: ItemGrade;
};

export type FishingRodItemInfo = {
  key: FishingRodItemKey;
  name: string;
  description: string;
};

export const fishingRods = registerItems<FishingRodItemInfo>([
  {
    key: FishingRod.FISHING_ROD,
    name: "Fishing Rod",
    description: "A simple rod and reel for catching fish. Ideal for beginners.",
  },
]);

/***
 * Type guards for fishing rods
 */
export function isItemKeyFishingRod(key: string): key is FishingRodItemKey {
  return fishingRods.has(key as FishingRodItemKey);
}

export function isItemFishingRod(item: Item): item is FishingRodItem {
  return isItemKeyFishingRod(item.key);
}
