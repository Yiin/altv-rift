import { ItemKey } from "..";
import { ItemType } from "../item-type";

export const consumables = {
  simple_medkit: {
    key: "simple_medkit",
    itemType: ItemType.CONSUMABLE,
    name: "Basic Survival Medkit",
    description:
      "A compact bundle of medical essentials. This no-frills kit holds just enough to patch up small injuries and stave off infection. It may not seem like much, but in this desperate landscape, it could spell the difference between life and death.",
  },
} as const;

export type ConsumableItemKey = keyof typeof consumables;

export function isItemConsumable(key: ItemKey): key is ConsumableItemKey {
  return key in consumables;
}
