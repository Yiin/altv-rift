import { registerItems } from "../items-registry";
import { makeKeys } from "../../../utility/make-keys";
import { Item } from "../types";
import { ItemGrade } from "../enums";
import { FishingBaitItem } from "./fish-bait.items";

export const Tool = makeKeys<ToolItemKey>()({
  PICKAXE: "pickaxe",
  HATCHET: "hatchet",
  FISHING_ROD: "fishingrod",
  SHOVEL: "shovel",
});

export type ToolItemKey = Brand<string, "ToolItemKey">;

export type FishingRodItem = {
  key: ToolItemKey;
  grade: ItemGrade;
  bait?: FishingBaitItem | null;
};

export type ToolItem = {
  key: ToolItemKey;
  grade: ItemGrade;
} | FishingRodItem;

export type ToolItemInfo = {
  key: ToolItemKey;
  name: string;
  description: string;
};

export const tools = registerItems<ToolItemInfo>([
  {
    key: Tool.PICKAXE,
    name: "Basic Pickaxe",
    description:
      "A simple, yet sturdy tool. Essential for beginners looking to mine and gather resources.",
  },
  {
    key: Tool.HATCHET,
    name: "Basic Hatchet",
    description:
      "A straightforward tool, forged for simplicity. While it may lack frills, it's reliable for everyday chopping and crafting.",
  },
  {
    key: Tool.FISHING_ROD,
    name: "Fishing Rod",
    description: "A simple rod and reel for catching fish. Ideal for beginners.",
  },
  {
    key: Tool.SHOVEL,
    name: "Basic Shovel",
    description:
      "A simple tool that can be used to dig and plant. Essential for beginners looking to find and harvest resources.",
  },
]);

export function isItemKeyTool(key: string): key is ToolItemKey {
  return tools.has(key as ToolItemKey);
}

export function isItemTool(item: Item): item is ToolItem {
  return isItemKeyTool(item.key);
}

export function isItemKeyPickaxe(key: string): key is typeof Tool.PICKAXE {
  return [Tool.PICKAXE].includes(key as ToolItemKey);
}

export function isItemKeyHatchet(key: string): key is typeof Tool.HATCHET {
  return [Tool.HATCHET].includes(key as ToolItemKey);
}

export function isItemKeyFishingRod(key: string): key is typeof Tool.FISHING_ROD {
  return [Tool.FISHING_ROD].includes(key as ToolItemKey);
}

export function isItemFishingRod(item: Item): item is FishingRodItem {
  return isItemKeyFishingRod(item.key);
}

export function isItemKeyShovel(key: string): key is typeof Tool.SHOVEL {
  return [Tool.SHOVEL].includes(key as ToolItemKey);
}
