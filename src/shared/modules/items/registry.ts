import { ItemType } from "@prisma/client/edge";
import { Item } from "@shared/interfaces";
import { ammo } from "./ammo";
import { clothing } from "./clothing";
import { consumables } from "./consumables";
import { materials } from "./materials";
import { getWeaponData, weapons } from "./weapons";
import { ItemKey } from "./types";
import { basics } from "./basic";

export const ITEMS_REGISTRY = {
  ...weapons,
  ...ammo,
  ...clothing,
  ...consumables,
  ...materials,
  ...basics,
} as const;

export type ItemInfo = (typeof ITEMS_REGISTRY)[ItemKey];

export function isValidItem(key: string): key is ItemKey {
  return key in ITEMS_REGISTRY;
}

export function getItemInfoByKey<K extends ItemKey>(key: K): (typeof ITEMS_REGISTRY)[K] {
  return ITEMS_REGISTRY[key];
}

export function getItemType<K extends ItemKey>(key: K) {
  try {
    return getItemInfoByKey(key).itemType;
  } catch (e) {
    console.log(`Error: ${key} is not a valid item key.`);
    throw e;
  }
}

export function getItemName(key: ItemKey) {
  const item = getItemInfoByKey(key);

  switch (item.itemType) {
    case ItemType.FIREARM_WEAPON:
    case ItemType.THROWABLE_WEAPON:
    case ItemType.MELEE_WEAPON:
      return getWeaponData(item.hash)?.Name;
    default:
      return item.name ?? "Unknown Item";
  }
}

export function getItemDescription(key: ItemKey) {
  return getItemInfoByKey(key).description;
}

export function getItemEquipmentSlot(item: Item) {
  switch (item.type) {
    case ItemType.AMMO:
      return "ammo";
    case ItemType.FIREARM_WEAPON:
    case ItemType.THROWABLE_WEAPON:
    case ItemType.MELEE_WEAPON:
      return "weapon";
    case ItemType.CLOTHING:
      const itemInfo = getItemInfoByKey(item.key);
      return itemInfo.equipmentSlot;
  }
  return;
}
