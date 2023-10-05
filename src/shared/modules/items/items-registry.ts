import { ItemInfo, ItemInfoByKey, ItemKey } from "./types";

const ITEMS_REGISTRY: Map<ItemKey, ItemInfo> = new Map();

/**
 * Register an item in the items registry so it's available for use.
 */
export function registerItem(info: ItemInfo) {
  ITEMS_REGISTRY.set(info.key, info);
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
export function getItemDescription(key: ItemKey) {
  const itemInfo = getItemInfoByKey(key);
  return "description" in itemInfo ? itemInfo.description : "";
}
