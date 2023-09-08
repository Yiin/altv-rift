import { registerItem } from "../items-registry";
import { Item } from "../types";

export const Tools = {
  PICKAXE: "pickaxe",
} as const;

export type ToolItemKey = (typeof Tools)[keyof typeof Tools];

export type ToolItem = {
  key: ToolItemKey;
};

export type ToolItemInfo = {
  key: ToolItemKey;
  name: string;
  description: string;
};

export const tools: Record<ToolItemKey, ToolItemInfo> = {
  pickaxe: {
    key: "pickaxe",
    name: "Simple Pickaxe",
    description: "A simple pickaxe for mining.",
  },
};

/**
 * Register all tools.
 */
for (const [key, info] of Object.entries(tools)) {
  registerItem(key as ToolItemKey, info);
}

export function isItemKeyTool(key: string): key is ToolItemKey {
  return key in tools;
}

export function isItemTool(item: Item): item is ToolItem {
  return isItemKeyTool(item.key);
}
