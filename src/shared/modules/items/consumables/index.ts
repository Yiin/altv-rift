import { ItemType } from "@prisma/client/edge";
import { ItemKey } from "../types";
import { ItemFlags } from "../item-flags";

export const Consumable = {
  SIMPLE_MEDKIT: "simple_medkit",
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
};

export function isItemConsumable(key: ItemKey): key is ConsumableItemKey {
  return key in consumables;
}
