import { registerItem, registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";

export const Pickaxe = makeKeys<PickaxeItemKey>()({
  BASIC_PICKAXE: "basic_pickaxe",
  ADVANCED_PICKAXE: "advanced_pickaxe",
  EXPERT_PICKAXE: "expert_pickaxe",
  ELITE_PICKAXE: "elite_pickaxe",
  EPIC_PICKAXE: "epic_pickaxe",
});

export type PickaxeItemKey = Brand<string, "PickaxeItemKey">;

export type PickaxeItem = {
  key: PickaxeItemKey;
};

export type PickaxeItemInfo = {
  key: PickaxeItemKey;
  name: string;
  description: string;
};

export const pickaxes = registerItems<PickaxeItemInfo>([
  {
    key: Pickaxe.BASIC_PICKAXE,
    name: "Basic Pickaxe",
    description:
      "A simple, yet sturdy tool. Essential for beginners looking to mine and gather resources.",
  },
  {
    key: Pickaxe.ADVANCED_PICKAXE,
    name: "Advanced Pickaxe",
    description:
      "Enhanced with improved metal, this pickaxe digs deeper and lasts longer. Ideal for seasoned miners.",
  },
  {
    key: Pickaxe.EXPERT_PICKAXE,
    name: "Expert Pickaxe",
    description:
      "Crafted with precision and designed for efficiency, this pickaxe is a testament to superior mining craftsmanship.",
  },
  {
    key: Pickaxe.ELITE_PICKAXE,
    name: "Elite Pickaxe",
    description:
      "A culmination of tradition and advanced metallurgy, this pickaxe ensures maximum extraction with minimal effort.",
  },
  {
    key: Pickaxe.EPIC_PICKAXE,
    name: "Epic Pickaxe",
    description:
      "Forged from the rarest metals and honed to perfection, this pickaxe represents the pinnacle of mining excellence.",
  },
]);

export function isItemKeyPickaxe(key: string): key is PickaxeItemKey {
  return pickaxes.has(key as PickaxeItemKey);
}

export function isItemPickaxe(item: Item): item is PickaxeItem {
  return isItemKeyPickaxe(item.key);
}
