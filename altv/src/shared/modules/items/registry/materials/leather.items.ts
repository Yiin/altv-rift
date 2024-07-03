import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Leather = makeKeys<LeatherItemKey>()({
  LEATHER: "leather",
});

export type LeatherItemKey = Brand<string, "LeatherItemKey">;

export type LeatherItem = {
  key: LeatherItemKey;
  amount: number;
  grade: ItemGrade;
};

export type LeatherItemInfo = {
  key: LeatherItemKey;
  name: string;
  description: string;
};

const leathers = registerItems<LeatherItemInfo>([
  {
    key: Leather.LEATHER,
    name: "Leather",
    description: "Tanned and treated animal hide, this versatile material is essential for crafting various items.",
  },
]);

export function isItemKeyLeather(key: string): key is LeatherItemKey {
  return leathers.has(key as LeatherItemKey);
}

export function isItemLeather(item: Item): item is LeatherItem {
  return isItemKeyLeather(item.key);
}
