import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Leather = makeKeys<LeatherItemKey>()({
  COMMON_LEATHER: "common_leather",
  UNCOMMON_LEATHER: "uncommon_leather",
  RARE_LEATHER: "rare_leather",
  EPIC_LEATHER: "epic_leather",
  LEGENDARY_LEATHER: "legendary_leather",
});

export type LeatherItemKey = Brand<string, "LeatherItemKey">;

export type LeatherItem = {
  key: LeatherItemKey;
  amount: number;
  grade: ItemGrade; // hardcoded in create-item.ts to match the item key
};

export type LeatherItemInfo = {
  key: LeatherItemKey;
  name: string;
  description: string;
};

const leathers = registerItems<LeatherItemInfo>([
  {
    key: Leather.COMMON_LEATHER,
    name: "Common Leather",
    description: "Tanned and treated animal hide, this versatile material is essential for crafting various items.",
  },
  {
    key: Leather.UNCOMMON_LEATHER,
    name: "Uncommon Leather",
    description: "Tanned and treated animal hide, this versatile material is essential for crafting various items.",
  },
  {
    key: Leather.RARE_LEATHER,
    name: "Rare Leather",
    description: "Tanned and treated animal hide, this versatile material is essential for crafting various items.",
  },
  {
    key: Leather.EPIC_LEATHER,
    name: "Epic Leather",
    description: "Tanned and treated animal hide, this versatile material is essential for crafting various items.",
  },
  {
    key: Leather.LEGENDARY_LEATHER,
    name: "Legendary Leather",
    description: "Tanned and treated animal hide, this versatile material is essential for crafting various items.",
  },
]);

export function isItemKeyLeather(key: string): key is LeatherItemKey {
  return leathers.has(key as LeatherItemKey);
}

export function isItemLeather(item: Item): item is LeatherItem {
  return isItemKeyLeather(item.key);
}

export function getLeatherByGrade(grade: ItemGrade): LeatherItemKey {
  switch (grade) {
    case ItemGrade.COMMON:
      return Leather.COMMON_LEATHER;
    case ItemGrade.UNCOMMON:
      return Leather.UNCOMMON_LEATHER;
    case ItemGrade.RARE:
      return Leather.RARE_LEATHER;
    case ItemGrade.EPIC:
      return Leather.EPIC_LEATHER;
    case ItemGrade.LEGENDARY:
      return Leather.LEGENDARY_LEATHER;
  }
  throw new Error(`Invalid leather grade: ${grade}`);
}
