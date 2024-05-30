import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Wood = makeKeys<WoodItemKey>()({
  WOOD: "wood",
});

export type WoodItemKey = Brand<string, "WoodItemKey">;

export type WoodItem = {
  key: WoodItemKey;
  amount: number;
  grade: ItemGrade;
};

export type WoodItemInfo = {
  key: WoodItemKey;
  name: string;
  description: string;
};

const woods = registerItems<WoodItemInfo>([
  {
    key: Wood.WOOD,
    name: "Wood",
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
