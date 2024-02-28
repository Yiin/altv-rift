import { registerItem, registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item, ItemKey } from "../../types";

export const Wood = makeKeys<WoodItemKey>()({
  BASIC_WOOD: "basic_wood",
  ADVANCED_WOOD: "advanced_wood",
  EXPERT_WOOD: "expert_wood",
  ELITE_WOOD: "elite_wood",
  EPIC_WOOD: "epic_wood",
});

export type WoodItemKey = Brand<string, "WoodItemKey">;

export type WoodItem = {
  key: WoodItemKey;
  amount: number;
};

export type WoodItemInfo = {
  key: WoodItemKey;
  name: string;
  description: string;
};

const woods = registerItems<WoodItemInfo>([
  {
    key: Wood.BASIC_WOOD,
    name: "Basic Wood",
    description:
      "Freshly processed from raw tree logs, this wood is simple yet reliable. Ideal for everyday crafting needs.",
  },
  {
    key: Wood.ADVANCED_WOOD,
    name: "Advanced Wood",
    description:
      "Treated and refined, this wood boasts enhanced durability. Perfect for crafting items requiring precision and resilience.",
  },
  {
    key: Wood.EXPERT_WOOD,
    name: "Expert Wood",
    description:
      "The pinnacle of wood processing, reserved for the most intricate of crafting projects. Its flawless finish speaks of unmatched craftsmanship.",
  },
  {
    key: Wood.ELITE_WOOD,
    name: "Elite Wood",
    description:
      "Expertly processed and carefully selected, this wood stands out for its superior quality. A favorite among professionals.",
  },
  {
    key: Wood.EPIC_WOOD,
    name: "Epic Wood",
    description:
      "Its unmatched quality and rare origin make it the ultimate choice for crafting masterpieces.",
  },
]);

export function isItemKeyWood(key: ItemKey): key is WoodItemKey {
  return woods.has(key as WoodItemKey);
}

export function isItemWood(item: Item): item is WoodItem {
  return isItemKeyWood(item.key);
}
