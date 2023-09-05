import { ItemType } from "@prisma/client/edge";
import { ItemKey } from "../types";
import { ItemFlags } from "../item-flags";

export const Consumable = {
  SIMPLE_MEDKIT: "simple_medkit",

  COOKED_TROUT: "cookedtrout",
  COOKED_SALMON: "cookedsalmon",
  COOKED_BASS: "cookedbass",
  COOKED_CATFISH: "cookedcatfish",
  COOKED_PIKE: "cookedpike",
  COOKED_TUNA: "cookedtuna",
  COOKED_MACKEREL: "cookedmackerel",
  COOKED_CARP: "cookedcarp",
  COOKED_RED_SNAPPER: "cookedredsnapper",
  COOKED_SWORDFISH: "cookedswordfish",
  COOKED_OCTOPUS: "cookedoctopus",
  COOKED_ELECTRIC_EEL: "cookedelectriceel",
  COOKED_HAMMERHEAD_SHARK: "cookedhammerheadshark",
  COOKED_GIANT_SQUID: "cookedgiantsquid",
  COOKED_GOLDEN_KOI: "cookedgoldenkoi",
} as const;

export type ConsumableItemKey = (typeof Consumable)[keyof typeof Consumable];

export type ConsumableItemInfo = {
  key: ConsumableItemKey;
  itemType: typeof ItemType.CONSUMABLE;
  name: string;
  description: string;
  flags: ItemFlags;
};

export const consumables: Record<ConsumableItemKey, ConsumableItemInfo> = {
  simple_medkit: {
    key: "simple_medkit",
    itemType: ItemType.CONSUMABLE,
    name: "Basic Survival Medkit",
    description:
      "A compact bundle of medical essentials. This no-frills kit holds just enough to patch up small injuries and stave off infection. It may not seem like much, but in this desperate landscape, it could spell the difference between life and death.",
    flags: ItemFlags.IsUsable,
  },
  cookedtrout: {
    key: "cookedtrout",
    itemType: "CONSUMABLE",
    name: "Cooked Trout",
    description: "Delicious and nutritious when cooked.",
    flags: ItemFlags.IsEdible,
  },
  cookedsalmon: {
    key: "cookedsalmon",
    itemType: "CONSUMABLE",
    name: "Cooked Salmon",
    description: "Rich in flavor and healthy fats.",
    flags: ItemFlags.IsEdible,
  },
  cookedbass: {
    key: "cookedbass",
    itemType: "CONSUMABLE",
    name: "Cooked Bass",
    description: "Tasty and fulfilling.",
    flags: ItemFlags.IsEdible,
  },
  cookedcatfish: {
    key: "cookedcatfish",
    itemType: "CONSUMABLE",
    name: "Cooked Catfish",
    description: "Mild and flaky when cooked.",
    flags: ItemFlags.IsEdible,
  },
  cookedpike: {
    key: "cookedpike",
    itemType: "CONSUMABLE",
    name: "Cooked Pike",
    description: "Firm and lean, a filling meal.",
    flags: ItemFlags.IsEdible,
  },
  cookedtuna: {
    key: "cookedtuna",
    itemType: "CONSUMABLE",
    name: "Cooked Tuna",
    description: "Lean and rich in protein.",
    flags: ItemFlags.IsEdible,
  },
  cookedmackerel: {
    key: "cookedmackerel",
    itemType: "CONSUMABLE",
    name: "Cooked Mackerel",
    description: "Flavorful and nutritious.",
    flags: ItemFlags.IsEdible,
  },
  cookedcarp: {
    key: "cookedcarp",
    itemType: "CONSUMABLE",
    name: "Cooked Carp",
    description: "Firm and satisfying.",
    flags: ItemFlags.IsEdible,
  },
  cookedredsnapper: {
    key: "cookedredsnapper",
    itemType: "CONSUMABLE",
    name: "Cooked Red Snapper",
    description: "Tender and flavorful.",
    flags: ItemFlags.IsEdible,
  },
  cookedswordfish: {
    key: "cookedswordfish",
    itemType: "CONSUMABLE",
    name: "Cooked Swordfish",
    description: "Hearty and filling.",
    flags: ItemFlags.IsEdible,
  },
  cookedoctopus: {
    key: "cookedoctopus",
    itemType: "CONSUMABLE",
    name: "Cooked Octopus",
    description: "Tender and delicious when cooked.",
    flags: ItemFlags.IsEdible,
  },
  cookedelectriceel: {
    key: "cookedelectriceel",
    itemType: "CONSUMABLE",
    name: "Cooked Electric Eel",
    description: "Delicacy when prepared correctly.",
    flags: ItemFlags.IsEdible,
  },
  cookedhammerheadshark: {
    key: "cookedhammerheadshark",
    itemType: "CONSUMABLE",
    name: "Cooked Hammerhead Shark",
    description: "Filling and rich in nutrients.",
    flags: ItemFlags.IsEdible,
  },
  cookedgiantsquid: {
    key: "cookedgiantsquid",
    itemType: "CONSUMABLE",
    name: "Cooked Giant Squid",
    description: "A rare and delicious treat.",
    flags: ItemFlags.IsEdible,
  },
  cookedgoldenkoi: {
    key: "cookedgoldenkoi",
    itemType: "CONSUMABLE",
    name: "Cooked Golden Koi",
    description: "Grants special benefits when consumed.",
    flags: ItemFlags.IsEdible,
  },
};

export function isItemConsumable(key: ItemKey): key is ConsumableItemKey {
  return key in consumables;
}
