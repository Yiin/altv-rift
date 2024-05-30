import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Pickaxe = makeKeys<PickaxeItemKey>()({
  PICKAXE: "pickaxe",
});

export type PickaxeItemKey = Brand<string, "PickaxeItemKey">;

export type PickaxeItem = {
  key: PickaxeItemKey;
  grade: ItemGrade;
};

export type PickaxeItemInfo = {
  key: PickaxeItemKey;
  name: string;
  description: string;
};

export const pickaxes = registerItems<PickaxeItemInfo>([
  {
    key: Pickaxe.PICKAXE,
    name: "Basic Pickaxe",
    description:
      "A simple, yet sturdy tool. Essential for beginners looking to mine and gather resources.",
  },
]);

export function isItemKeyPickaxe(key: string): key is PickaxeItemKey {
  return pickaxes.has(key as PickaxeItemKey);
}

export function isItemPickaxe(item: Item): item is PickaxeItem {
  return isItemKeyPickaxe(item.key);
}
