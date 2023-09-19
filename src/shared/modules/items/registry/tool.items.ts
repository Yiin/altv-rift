import { registerItem } from "../items-registry";
import { makeItemKeys } from "../lib/make-item-keys";
import { Item } from "../types";

export const Tools = makeItemKeys<ToolItemKey>()({
  PICKAXE: "pickaxe",
});

export type ToolItemKey = Brand<string, "ToolItemKey">;

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
} as Record<ToolItemKey, ToolItemInfo>;

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
