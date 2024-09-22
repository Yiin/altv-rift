import { ItemInfo, ItemInfoByKey, ItemKey } from "./types";

export const ITEMS_REGISTRY: Map<ItemKey, ItemInfo> = new Map();

/**
 * Register an item in the items registry so it's available for use.
 */
export function registerItem(info: ItemInfo): void {
  if (ITEMS_REGISTRY.has(info.key) && !window) {
    throw new Error(
      `Item with key "${info.key}" is already registered: ${JSON.stringify(ITEMS_REGISTRY.get(info.key))} -> ${JSON.stringify(info)}`,
    );
  }
  ITEMS_REGISTRY.set(info.key, info);
}

/**
 * Register multiple items in the items registry so they're available for use.
 */
export function registerItems<T extends ItemInfo>(items: T[]): Map<T["key"], T> {
  const map = new Map<T["key"], T>();
  for (const item of items) {
    registerItem(item);
    map.set(item.key, item);
  }
  return map;
}

/**
 * Checks if there is a registered item with the given key.
 */
export function isValidItem(key: string): key is ItemKey {
  return ITEMS_REGISTRY.has(key as ItemKey);
}

/**
 * Gives registered meta information of an item by it's key.
 */
export function getItemInfoByKey<K extends ItemKey>(key: K): ItemInfoByKey<K> {
  return ITEMS_REGISTRY.get(key) as ItemInfoByKey<K>;
}

/**
 * Gives the summary description for an item by it's key.
 */
export function getItemDescription(key: ItemKey): string {
  const itemInfo = getItemInfoByKey(key);
  return itemInfo && "description" in itemInfo && itemInfo.description ? itemInfo.description : "";
}

/**
 * Returns all registered item keys.
 */
export function getAllItemKeys(): ItemKey[] {
  return Array.from(ITEMS_REGISTRY.keys());
}
