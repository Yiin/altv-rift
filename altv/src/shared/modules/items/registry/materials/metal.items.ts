import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Metal = makeKeys<MetalItemKey>()({
  METAL: "metal",
});

export type MetalItemKey = Brand<string, "MetalItemKey">;

export type MetalItem = {
  key: MetalItemKey;
  amount: number;
  grade: ItemGrade;
};

export type MetalItemInfo = {
  key: MetalItemKey;
  name: string;
  description: string;
};

const metals = registerItems<MetalItemInfo>([
  {
    key: Metal.METAL,
    name: "Metal",
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
