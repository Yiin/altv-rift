import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { ItemGrade } from "../../enums";

export const ItemComponents = makeKeys<ItemComponentsItemKey>()({
  COMMON_ITEM_COMPONENTS: "common_item_components",
  UNCOMMON_ITEM_COMPONENTS: "uncommon_item_components",
  RARE_ITEM_COMPONENTS: "rare_item_components",
  EPIC_ITEM_COMPONENTS: "epic_item_components",
  LEGENDARY_ITEM_COMPONENTS: "legendary_item_components",
});

export type ItemComponentsItemKey = Brand<string, "ItemComponentsItemKey">;

export type ItemComponentsItem = {
  key: ItemComponentsItemKey;
  amount: number;
  grade: ItemGrade; // hardcoded in create-item.ts to match the item key
};

export type ItemComponentsItemInfo = {
  key: ItemComponentsItemKey;
  name: string;
  description: string;
};

export const ItemComponentss = registerItems<ItemComponentsItemInfo>([
  {
    key: ItemComponents.COMMON_ITEM_COMPONENTS,
    name: "Common Item Components",
    description: "Everyday scraps and junk—cheap, easy to find, and just enough to keep your gear from falling apart.",
  },
  {
    key: ItemComponents.UNCOMMON_ITEM_COMPONENTS,
    name: "Uncommon Item Components",
    description: "Not your average trash. These parts are tougher to come by and give your gear a serious edge in the streets.",
  },
  {
    key: ItemComponents.RARE_ITEM_COMPONENTS,
    name: "Rare Item Components",
    description: "Hard-to-find, high-grade parts that make the difference between life and death when the heat is on.",
  },
  {
    key: ItemComponents.EPIC_ITEM_COMPONENTS,
    name: "Epic Item Components",
    description: "Top-tier components, scavenged from the best. These are the pieces that turn ordinary gear into a force to be reckoned with.",
  },
  {
    key: ItemComponents.LEGENDARY_ITEM_COMPONENTS,
    name: "Legendary Item Components",
    description: "Virtually impossible to find, these legendary parts are whispered about in the darkest corners of the city. They turn weapons into legends.",
  },
]);

export function isItemKeyItemComponents(key: string): key is ItemComponentsItemKey {
  return ItemComponentss.has(key as ItemComponentsItemKey);
}
