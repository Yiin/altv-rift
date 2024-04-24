import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item } from "../../types";
import { ItemGrade } from "../../enums";

export const Scrap = makeKeys<ScrapItemKey>()({
  SCRAP: "scrap",
});

export type ScrapItemKey = Brand<string, "ScrapItemKey">;

export type ScrapItem = {
  key: ScrapItemKey;
  amount: number;
  grade: ItemGrade;
};

export type ScrapItemInfo = {
  key: ScrapItemKey;
  name: string;
  description: string;
};

const scraps = registerItems<ScrapItemInfo>([
  {
    key: Scrap.SCRAP,
    name: "Scrap",
    description: "A piece of scrap metal.",
  },
]);

export function isItemKeyScrap(key: string): key is ScrapItemKey {
  return scraps.has(key as ScrapItemKey);
}

export function isItemScrap(item: Item): item is ScrapItem {
  return isItemKeyScrap(item.key);
}
