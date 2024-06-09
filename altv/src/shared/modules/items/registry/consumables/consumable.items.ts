import { Item } from "../../types";
import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { ItemTier } from "../../enums";

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

export enum ConsumableItemEffectType {
  HEAL = "heal",
}

export type ConsumableItemEffect = {
  type: ConsumableItemEffectType.HEAL;
  amount: number;
};

export type ConsumableItemInfo = {
  key: ConsumableItemKey;
  name: string;
  description: string;
  tier: ItemTier;
  effects: ConsumableItemEffect[];
};

export const consumables = registerItems<ConsumableItemInfo>([
  {
    key: Consumable.SIMPLE_MEDKIT,
    name: "Basic Survival Medkit",
    description:
      "A compact bundle of medical essentials.",
    tier: ItemTier.E,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 50
      }
    ]
  },
  {
    key: Consumable.COOKED_TROUT,
    name: "Cooked Trout",
    description: "Delicious and nutritious when cooked.",
    tier: ItemTier.F,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 30
      }
    ]
  },
  {
    key: Consumable.COOKED_SALMON,
    name: "Cooked Salmon",
    description: "Rich in flavor and healthy fats.",
    tier: ItemTier.E,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 50
      }
    ]
  },
  {
    key: Consumable.COOKED_BASS,
    name: "Cooked Bass",
    description: "Tasty and fulfilling.",
    tier: ItemTier.E,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 60
      }
    ]
  },
  {
    key: Consumable.COOKED_CATFISH,
    name: "Cooked Catfish",
    description: "Mild and flaky when cooked.",
    tier: ItemTier.D,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 80
      }
    ]
  },
  {
    key: Consumable.COOKED_PIKE,
    name: "Cooked Pike",
    description: "Firm and lean, a filling meal.",
    tier: ItemTier.D,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 100
      }
    ]
  },
  {
    key: Consumable.COOKED_TUNA,
    name: "Cooked Tuna",
    description: "Lean and rich in protein.",
    tier: ItemTier.C,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 150
      }
    ]
  },
  {
    key: Consumable.COOKED_MACKEREL,
    name: "Cooked Mackerel",
    description: "Flavorful and nutritious.",
    tier: ItemTier.C,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 200
      }
    ]
  },
  {
    key: Consumable.COOKED_CARP,
    name: "Cooked Carp",
    description: "Firm and satisfying.",
    tier: ItemTier.B,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 300
      }
    ]
  },
  {
    key: Consumable.COOKED_RED_SNAPPER,
    name: "Cooked Red Snapper",
    description: "Tender and flavorful.",
    tier: ItemTier.B,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 400
      }
    ]
  },
  {
    key: Consumable.COOKED_SWORDFISH,
    name: "Cooked Swordfish",
    description: "Hearty and filling.",
    tier: ItemTier.A,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 600
      }
    ]
  },
  {
    key: Consumable.COOKED_OCTOPUS,
    name: "Cooked Octopus",
    description: "Tender and delicious when cooked.",
    tier: ItemTier.A,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 800
      }
    ]
  },
  {
    key: Consumable.COOKED_ELECTRIC_EEL,
    name: "Cooked Electric Eel",
    description: "Delicacy when prepared correctly.",
    tier: ItemTier.A,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 1000
      }
    ]
  },
  {
    key: Consumable.COOKED_HAMMERHEAD_SHARK,
    name: "Cooked Hammerhead Shark",
    description: "Filling and rich in nutrients.",
    tier: ItemTier.S,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 1300
      }
    ]
  },
  {
    key: Consumable.COOKED_GIANT_SQUID,
    name: "Cooked Giant Squid",
    description: "A rare and delicious treat.",
    tier: ItemTier.S,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 1400
      }
    ]
  },
  {
    key: Consumable.COOKED_GOLDEN_KOI,
    name: "Cooked Golden Koi",
    description: "Grants special benefits when consumed.",
    tier: ItemTier.S,
    effects: [
      {
        type: ConsumableItemEffectType.HEAL,
        amount: 1500
      }
    ]
  },
]);

export function isItemKeyConsumable(key: string): key is ConsumableItemKey {
  return consumables.has(key as ConsumableItemKey);
}

export function isItemConsumable(item: Item): item is ConsumableItem {
  return isItemKeyConsumable(item.key);
}
