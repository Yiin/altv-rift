import { registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";
import { Item, ItemKey } from "../../types";

export const Ore = makeKeys<OreItemKey>()({
  IRON_ORE: "ironore",
  SILVER_ORE: "silverore",
  TITANIUM_ORE: "titaniumore",
  ZINC_ORE: "zincore",
  RAW_DIAMOND: "rawdiamond",
});

export type OreItemKey = Brand<string, "OreItemKey">;

export type OreItem = {
  key: OreItemKey;
  amount: number;
};

export type OreItemInfo = {
  key: OreItemKey;
  name: string;
  description: string;
};

export const ore = registerItems<OreItemInfo>([
  {
    key: Ore.IRON_ORE,
    name: "Iron ore",
    description: "Forged in the heart of dying stars, this iron ore is the backbone of the mightiest weapons. Unleash its potential to craft arms that can pierce the thickest armor.",
  },
  {
    key: Ore.SILVER_ORE,
    name: "Silver ore",
    description: "More than just a precious metal, this silver ore harbors untold magical properties. Perfect for enchanting ammunition that seeks the enemy's heart.",
  },
  {
    key: Ore.TITANIUM_ORE,
    name: "Titanium ore",
    description: "Harvested from the toughest veins deep within the earth, titanium ore promises to create armor that stands unyielded against the fiercest attacks.",
  },
  {
    key: Ore.ZINC_ORE,
    name: "Zinc ore",
    description: "Often overlooked, zinc is the secret ingredient that alloys strength with malleability. Ideal for crafting flexible yet durable weapon parts.",
  },
  {
    key: Ore.RAW_DIAMOND,
    name: "Raw diamond",
    description: "Diamonds aren't just a symbol of wealth; they're the forgers of the sharpest edges. Embed them in your weapons to cut through the chaos of battle with ease.",
  },
]);

export function isItemKeyOre(key: ItemKey): key is OreItemKey {
  return ore.has(key as OreItemKey);
}

export function isItemOre(item: Item): item is OreItem {
  return isItemKeyOre(item.key);
}
