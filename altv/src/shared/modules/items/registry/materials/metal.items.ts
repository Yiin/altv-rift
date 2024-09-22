import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Metal = makeKeys<MetalItemKey>()({
  COMMON_METAL: "common_metal",
  UNCOMMON_METAL: "uncommon_metal",
  RARE_METAL: "rare_metal",
  EPIC_METAL: "epic_metal",
  LEGENDARY_METAL: "legendary_metal",
});

export type MetalItemKey = Brand<string, "MetalItemKey">;

export type MetalItem = {
  key: MetalItemKey;
  amount: number;
  grade: ItemGrade; // hardcoded in create-item.ts to match the item key
};

export type MetalItemInfo = {
  key: MetalItemKey;
  name: string;
  description: string;
};

const metals = registerItems<MetalItemInfo>([
  {
    key: Metal.COMMON_METAL,
    name: "Common Metal",
    description:
      "Extracted and smelted to its purest form, this metal serves as the foundation for countless creations. A staple in any craftsman's inventory",
  },
  {
    key: Metal.UNCOMMON_METAL,
    name: "Uncommon Metal",
    description:
      "Extracted and smelted to its purest form, this metal serves as the foundation for countless creations. A staple in any craftsman's inventory",
  },
  {
    key: Metal.RARE_METAL,
    name: "Rare Metal",
    description:
      "Extracted and smelted to its purest form, this metal serves as the foundation for countless creations. A staple in any craftsman's inventory",
  },
  {
    key: Metal.EPIC_METAL,
    name: "Epic Metal",
    description:
      "Extracted and smelted to its purest form, this metal serves as the foundation for countless creations. A staple in any craftsman's inventory",
  },
  {
    key: Metal.LEGENDARY_METAL,
    name: "Legendary Metal",
    description:
      "Extracted and smelted to its purest form, this metal serves as the foundation for countless creations. A staple in any craftsman's inventory",
  },
]);

export function isItemKeyMetal(key: string): key is MetalItemKey {
  return metals.has(key as MetalItemKey);
}

export function isItemMetal(item: Item): item is MetalItem {
  return isItemKeyMetal(item.key);
}

export function getMetalByGrade(grade: ItemGrade): MetalItemKey {
  switch (grade) {
    case ItemGrade.COMMON:
      return Metal.COMMON_METAL;
    case ItemGrade.UNCOMMON:
      return Metal.UNCOMMON_METAL;
    case ItemGrade.RARE:
      return Metal.RARE_METAL;
    case ItemGrade.EPIC:
      return Metal.EPIC_METAL;
    case ItemGrade.LEGENDARY:
      return Metal.LEGENDARY_METAL;
  }
  throw new Error(`Invalid metal grade: ${grade}`);
}
