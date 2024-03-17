import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item, ItemKey } from "../../types";
import { ItemGrade } from "../../enums";

export const Scrap = makeKeys<ScrapItemKey>()({
  COMMON_SCRAP: "common_scrap",
  UNCOMMON_SCRAP: "uncommon_scrap",
  RARE_SCRAP: "rare_scrap",
  EPIC_SCRAP: "epic_scrap",
  LEGENDARY_SCRAP: "legendary_scrap",
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
    key: Scrap.COMMON_SCRAP,
    name: "Basic Scrap",
    description: "You can craft base level items using these scraps.",
  },
  {
    key: Scrap.UNCOMMON_SCRAP,
    name: "Uncommon Scrap",
    description: "You can craft + level items using these scraps.",
  },
  {
    key: Scrap.RARE_SCRAP,
    name: "Rare Scrap",
    description: "You can craft ++ level items using these scraps.",
  },
  {
    key: Scrap.EPIC_SCRAP,
    name: "Epic Scrap",
    description: "You can craft +++ level items using these scraps.",
  },
  {
    key: Scrap.LEGENDARY_SCRAP,
    name: "Legendary Scrap",
    description: "You can craft ++++ level items using these scraps.",
  },
]);

export function isItemKeyScrap(key: ItemKey): key is ScrapItemKey {
  return scraps.has(key as ScrapItemKey);
}

export function isItemScrap(item: Item): item is ScrapItem {
  return isItemKeyScrap(item.key);
}

export function getScrapItemGrade(key: ScrapItemKey): ItemGrade {
  return {
    [Scrap.COMMON_SCRAP]: ItemGrade.BASE,
    [Scrap.UNCOMMON_SCRAP]: ItemGrade.ONE,
    [Scrap.RARE_SCRAP]: ItemGrade.TWO,
    [Scrap.EPIC_SCRAP]: ItemGrade.THREE,
    [Scrap.LEGENDARY_SCRAP]: ItemGrade.FOUR,
  }[key];
}
