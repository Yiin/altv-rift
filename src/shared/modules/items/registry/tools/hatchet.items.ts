import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Hatchet = makeKeys<HatchetItemKey>()({
  HATCHET: "hatchet",
});

export type HatchetItemKey = Brand<string, "HatchetItemKey">;

export type HatchetItem = {
  key: HatchetItemKey;
  grade: ItemGrade;
};

export type HatchetItemInfo = {
  key: HatchetItemKey;
  name: string;
  description: string;
};

export const hatchets = registerItems<HatchetItemInfo>([
  {
    key: Hatchet.HATCHET,
    name: "Basic Hatchet",
    description:
      "A straightforward tool, forged for simplicity. While it may lack frills, it's reliable for everyday chopping and crafting.",
  },
]);

export function isItemKeyHatchet(key: string): key is HatchetItemKey {
  return hatchets.has(key as HatchetItemKey);
}

export function isItemHatchet(item: Item): item is HatchetItem {
  return isItemKeyHatchet(item.key);
}
