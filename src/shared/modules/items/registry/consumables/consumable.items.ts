import { Item, ItemKey } from "../../types";
import { ItemFlags } from "../../enums";
import { registerItem } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";

export const Consumable = makeKeys<ConsumableItemKey>()({
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
});

export type ConsumableItemKey = Brand<string, "ConsumableItemKey">;

export type ConsumableItem = {
  key: ConsumableItemKey;

  amount: number;
};

export type ConsumableItemInfo = {
  key: ConsumableItemKey;
  name: string;
  description: string;
};

export const consumables: ConsumableItemInfo[] = [
  {
    key: Consumable.SIMPLE_MEDKIT,
    name: "Basic Survival Medkit",
    description:
      "A compact bundle of medical essentials. This no-frills kit holds just enough to patch up small injuries and stave off infection. It may not seem like much, but in this desperate landscape, it could spell the difference between life and death.",
  },
  {
    key: Consumable.COOKED_TROUT,
    name: "Cooked Trout",
    description: "Delicious and nutritious when cooked.",
  },
  {
    key: Consumable.COOKED_SALMON,
    name: "Cooked Salmon",
    description: "Rich in flavor and healthy fats.",
  },
  {
    key: Consumable.COOKED_BASS,
    name: "Cooked Bass",
    description: "Tasty and fulfilling.",
  },
  {
    key: Consumable.COOKED_CATFISH,
    name: "Cooked Catfish",
    description: "Mild and flaky when cooked.",
  },
  {
    key: Consumable.COOKED_PIKE,
    name: "Cooked Pike",
    description: "Firm and lean, a filling meal.",
  },
  {
    key: Consumable.COOKED_TUNA,
    name: "Cooked Tuna",
    description: "Lean and rich in protein.",
  },
  {
    key: Consumable.COOKED_MACKEREL,
    name: "Cooked Mackerel",
    description: "Flavorful and nutritious.",
  },
  {
    key: Consumable.COOKED_CARP,
    name: "Cooked Carp",
    description: "Firm and satisfying.",
  },
  {
    key: Consumable.COOKED_RED_SNAPPER,
    name: "Cooked Red Snapper",
    description: "Tender and flavorful.",
  },
  {
    key: Consumable.COOKED_SWORDFISH,
    name: "Cooked Swordfish",
    description: "Hearty and filling.",
  },
  {
    key: Consumable.COOKED_OCTOPUS,
    name: "Cooked Octopus",
    description: "Tender and delicious when cooked.",
  },
  {
    key: Consumable.COOKED_ELECTRIC_EEL,
    name: "Cooked Electric Eel",
    description: "Delicacy when prepared correctly.",
  },
  {
    key: Consumable.COOKED_HAMMERHEAD_SHARK,
    name: "Cooked Hammerhead Shark",
    description: "Filling and rich in nutrients.",
  },
  {
    key: Consumable.COOKED_GIANT_SQUID,
    name: "Cooked Giant Squid",
    description: "A rare and delicious treat.",
  },
  {
    key: Consumable.COOKED_GOLDEN_KOI,
    name: "Cooked Golden Koi",
    description: "Grants special benefits when consumed.",
  },
];

/**
 * Register all consumable items.
 */
for (const info of consumables) {
  registerItem(info);
}

export function isItemKeyConsumable(key: ItemKey): key is ConsumableItemKey {
  return consumables.some((info) => info.key === key);
}

export function isItemConsumable(item: Item): item is ConsumableItem {
  return isItemKeyConsumable(item.key);
}
