import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Wood = makeKeys<WoodItemKey>()({
  COMMON_WOOD: "common_wood",
  UNCOMMON_WOOD: "uncommon_wood",
  RARE_WOOD: "rare_wood",
  EPIC_WOOD: "epic_wood",
  LEGENDARY_WOOD: "legendary_wood",
});

export type WoodItemKey = Brand<string, "WoodItemKey">;

export type WoodItem = {
  key: WoodItemKey;
  amount: number;
  grade: ItemGrade; // hardcoded in create-item.ts to match the item key
};

export type WoodItemInfo = {
  key: WoodItemKey;
  name: string;
  description: string;
};

const woods = registerItems<WoodItemInfo>([
  {
    key: Wood.COMMON_WOOD,
    name: "Common Wood",
    description:
      "Freshly processed from raw tree logs, this wood is simple yet reliable. Ideal for everyday crafting needs.",
  },
  {
    key: Wood.UNCOMMON_WOOD,
    name: "Uncommon Wood",
    description:
      "Freshly processed from raw tree logs, this wood is simple yet reliable. Ideal for everyday crafting needs.",
  },
  {
    key: Wood.RARE_WOOD,
    name: "Rare Wood",
    description:
      "Freshly processed from raw tree logs, this wood is simple yet reliable. Ideal for everyday crafting needs.",
  },
  {
    key: Wood.EPIC_WOOD,
    name: "Epic Wood",
    description:
      "Freshly processed from raw tree logs, this wood is simple yet reliable. Ideal for everyday crafting needs.",
  },
  {
    key: Wood.LEGENDARY_WOOD,
    name: "Legendary Wood",
    description:
      "Freshly processed from raw tree logs, this wood is simple yet reliable. Ideal for everyday crafting needs.",
  },
]);

export function isItemKeyWood(key: string): key is WoodItemKey {
  return woods.has(key as WoodItemKey);
}

export function isItemWood(item: Item): item is WoodItem {
  return isItemKeyWood(item.key);
}

export function getWoodByGrade(grade: ItemGrade): WoodItemKey {
  switch (grade) {
    case ItemGrade.COMMON:
      return Wood.COMMON_WOOD;
    case ItemGrade.UNCOMMON:
      return Wood.UNCOMMON_WOOD;
    case ItemGrade.RARE:
      return Wood.RARE_WOOD;
    case ItemGrade.EPIC:
      return Wood.EPIC_WOOD;
    case ItemGrade.LEGENDARY:
      return Wood.LEGENDARY_WOOD;
  }

  throw new Error(`Invalid wood grade: ${grade}`);
}
