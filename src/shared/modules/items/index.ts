import {
  ItemData,
  AmmoItem,
  ClothingItem,
  WeaponItem,
} from "@shared/interfaces";
import { ammo, AmmoItemKey } from "./ammo";
import { clothing, ClothingItemKey } from "./clothing";
import { ItemType } from "./item-type";
import { getWeaponData, WeaponItemKey, weapons } from "./weapons";
export * from "./weapons";

export const ITEMS_REGISTRY = {
  ...weapons,
  ...ammo,
  ...clothing,
} as const;

export type ItemKey = WeaponItemKey | AmmoItemKey | ClothingItemKey;
export type WeaponItemInfo = (typeof ITEMS_REGISTRY)[WeaponItemKey];
export type AmmoItemInfo = (typeof ITEMS_REGISTRY)[AmmoItemKey];
export type ClothingItemInfo = (typeof ITEMS_REGISTRY)[ClothingItemKey];
export type ItemInfo = (typeof ITEMS_REGISTRY)[ItemKey];

export type ItemTypeByKey = {
  [K in WeaponItemKey]: typeof ItemType.WEAPON;
} & {
  [K in AmmoItemKey]: typeof ItemType.AMMO;
} & {
  [K in ClothingItemKey]: typeof ItemType.CLOTHING;
};

export function isValidItem(key: string): key is ItemKey {
  return key in ITEMS_REGISTRY;
}

export function findItemByKey<K extends ItemKey>(
  key: K
): (typeof ITEMS_REGISTRY)[K] {
  return ITEMS_REGISTRY[key];
}

export function getItemType(key: ItemKey) {
  return findItemByKey(key).itemType;
}

export function getItemName(key: ItemKey) {
  const item = findItemByKey(key);

  switch (item.itemType) {
    case ItemType.WEAPON:
      return getWeaponData(item.hash)?.Name;
    case ItemType.AMMO:
      return item.name;
    default:
      return "Unknown Item";
  }
}

export function getItemDescription(key: ItemKey) {
  return findItemByKey(key).description;
}

export function getItemData<T extends ItemData>(data: T) {
  return data[data.type] as T[typeof data.type];
}

export const itemDataDefaults = {
  [ItemType.WEAPON]: {
    durability: 100,
    customName: null,
    ammo: null,
    components: [],
    tints: [],
  } as WeaponItem,
  [ItemType.AMMO]: {
    amount: 0,
  } as AmmoItem,
  [ItemType.CLOTHING]: {
    durability: 100,
    customName: null,
    palette: 0,
  } as ClothingItem,
} as const;
