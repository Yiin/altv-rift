import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item, ItemKey } from "../../types";

export const Scrap = makeKeys<ScrapItemKey>()({
  BASIC_SCRAP: "basic_scrap",
  ADVANCED_SCRAP: "advanced_scrap",
  EXPERT_SCRAP: "expert_scrap",
  ELITE_SCRAP: "elite_scrap",
  EPIC_SCRAP: "epic_scrap",
});

export type ScrapItemKey = Brand<string, "ScrapItemKey">;

export type ScrapItem = {
  key: ScrapItemKey;
  amount: number;
};

export type ScrapItemInfo = {
  key: ScrapItemKey;
  name: string;
  description: string;
};

const scraps = registerItems<ScrapItemInfo>([
  {
    key: Scrap.BASIC_SCRAP,
    name: "Basic Scrap",
    description: "Basic Scrap"
  },
  {
    key: Scrap.ADVANCED_SCRAP,
    name: "Advanced Scrap",
    description: "Advanced Scrap",
  },
  {
    key: Scrap.EXPERT_SCRAP,
    name: "Expert Scrap",
    description: "Expert Scrap",
  },
  {
    key: Scrap.ELITE_SCRAP,
    name: "Elite Scrap",
    description: "Elite Scrap",
  },
  {
    key: Scrap.EPIC_SCRAP,
    name: "Epic Scrap",
    description: "Epic Scrap",
  },
]);

export function isItemKeyScrap(key: ItemKey): key is ScrapItemKey {
  return scraps.has(key as ScrapItemKey);
}

export function isItemScrap(item: Item): item is ScrapItem {
  return isItemKeyScrap(item.key);
}
