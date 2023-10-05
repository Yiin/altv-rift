import { registerItem } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item, ItemKey } from "../../types";

export const Metal = makeKeys<MetalItemKey>()({
  BASIC_METAL: "basic_metal",
  ADVANCED_METAL: "advanced_metal",
  EXPERT_METAL: "expert_metal",
  ELITE_METAL: "elite_metal",
  EPIC_METAL: "epic_metal",
});

export type MetalItemKey = Brand<string, "MetalItemKey">;

export type MetalItem = {
  key: MetalItemKey;
  amount: number;
};

export type MetalItemInfo = {
  key: MetalItemKey;
  name: string;
  description: string;
};

const metals: MetalItemInfo[] = [
  {
    key: Metal.BASIC_METAL,
    name: "Basic Metal",
    description:
      "Extracted and smelted to its purest form, this metal serves as the foundation for countless creations. A staple in any craftsman's inventory",
  },
  {
    key: Metal.ADVANCED_METAL,
    name: "Advanced Metal",
    description:
      "Treated and alloyed for added strength, this metal strikes the balance between durability and malleability. Crafters favor it for its dependable performance.",
  },
  {
    key: Metal.EXPERT_METAL,
    name: "Expert Metal",
    description:
      "Forged through innovative processes and drawing from centuries of metallurgical expertise, this metal is reserved for the most complex and demanding projects. It's the mark of a true artisan.",
  },
  {
    key: Metal.ELITE_METAL,
    name: "Elite Metal",
    description:
      "Painstakingly refined and meticulously inspected, this metal stands at the pinnacle of modern metallurgy. Its superior integrity is evident in every shimmer.",
  },
  {
    key: Metal.EPIC_METAL,
    name: "Epic Metal",
    description:
      "Sourced from the rarest ores and processed with unparalleled precision, this metal is legendary. Its exceptional properties and radiant luster are unmatched, making it the dream material for elite craftsmen.",
  },
];

/**
 * Register all metals.
 */
for (const info of metals) {
  registerItem(info);
}

export function isItemKeyMetal(key: ItemKey): key is MetalItemKey {
  return metals.some((info) => info.key === key);
}

export function isItemMetal(item: Item): item is MetalItem {
  return isItemKeyMetal(item.key);
}
