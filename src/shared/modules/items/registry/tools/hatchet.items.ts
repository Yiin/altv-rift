import { registerItem } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";

export const Hatchet = makeKeys<HatchetItemKey>()({
  BASIC_HATCHET: "basic_hatchet",
  ADVANCED_HATCHET: "advanced_hatchet",
  EXPERT_HATCHET: "expert_hatchet",
  ELITE_HATCHET: "elite_hatchet",
  EPIC_HATCHET: "epic_hatchet",
});

export type HatchetItemKey = Brand<string, "HatchetItemKey">;

export type HatchetItem = {
  key: HatchetItemKey;
};

export type HatchetItemInfo = {
  key: HatchetItemKey;
  name: string;
  description: string;
};

export const hatchets: HatchetItemInfo[] = [
  {
    key: Hatchet.BASIC_HATCHET,
    name: "Basic Hatchet",
    description:
      "A straightforward tool, forged for simplicity. While it may lack frills, it's reliable for everyday chopping and crafting.",
  },
  {
    key: Hatchet.ADVANCED_HATCHET,
    name: "Advanced Hatchet",
    description:
      "Reinforced with superior metal and a sharper edge, this hatchet ensures cleaner cuts and longer-lasting performance.",
  },
  {
    key: Hatchet.EXPERT_HATCHET,
    name: "Expert Hatchet",
    description:
      "The culmination of tradition and innovation, this hatchet boasts a design that maximizes efficiency and precision. Every swing is a statement of mastery.",
  },
  {
    key: Hatchet.ELITE_HATCHET,
    name: "Elite Hatchet",
    description:
      "Reinforced with superior metal and a sharper edge, this hatchet ensures cleaner cuts and longer-lasting performance.",
  },
  {
    key: Hatchet.EPIC_HATCHET,
    name: "Epic Hatchet",
    description:
      "Carved from the finest materials and imbued with legendary craftsmanship, this hatchet is a masterpiece. Its unparalleled edge and ergonomic design make it an emblem of excellence.",
  },
];

/**
 * Register all hatchets.
 */
for (const info of hatchets) {
  registerItem(info);
}

export function isItemKeyHatchet(key: string): key is HatchetItemKey {
  return hatchets.some((hatchet) => hatchet.key === key);
}

export function isItemHatchet(item: Item): item is HatchetItem {
  return isItemKeyHatchet(item.key);
}
