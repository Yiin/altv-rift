import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item, ItemKey } from "../../types";

export const Metal = makeKeys<MetalItemKey>()({
  COMMON_METAL: "common_metal",
  UNCOMMON_METAL: "uncommon_metal",
  RARE_METAL: "rare_metal",
  EPIC_METAL: "epic_metal",
  LEGENDARY_METAL: "legendary_metal",
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

const metals = registerItems<MetalItemInfo>([
  {
    key: Metal.COMMON_METAL,
    name: "Common Metal",
    description:
      "Extracted and smelted to its purest form, this metal serves as the foundation for countless creations. A staple in any craftsman's inventory",
  },
  {
    key: Metal.UNCOMMON_METAL,
    name: "Uncommon Metal",
    description:
      "Treated and alloyed for added strength, this metal strikes the balance between durability and malleability. Crafters favor it for its dependable performance.",
  },
  {
    key: Metal.RARE_METAL,
    name: "Rare Metal",
    description:
      "Forged through innovative processes and drawing from centuries of metallurgical rareise, this metal is reserved for the most complex and demanding projects. It's the mark of a true artisan.",
  },
  {
    key: Metal.EPIC_METAL,
    name: "Epic Metal",
    description:
      "Painstakingly refined and meticulously inspected, this metal stands at the pinnacle of modern metallurgy. Its superior integrity is evident in every shimmer.",
  },
  {
    key: Metal.LEGENDARY_METAL,
    name: "Legendary Metal",
    description:
      "Sourced from the rarest ores and processed with unparalleled precision, this metal is legendary. Its exceptional properties and radiant luster are unmatched, making it the dream material for great craftsmen.",
  },
]);

export function isItemKeyMetal(key: ItemKey): key is MetalItemKey {
  return metals.has(key as MetalItemKey);
}

export function isItemMetal(item: Item): item is MetalItem {
  return isItemKeyMetal(item.key);
}
