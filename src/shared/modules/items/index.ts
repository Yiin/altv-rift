import { ItemData, AmmoItem, ClothingItem, WeaponItem } from "../../interfaces";
import { ammo, AmmoItemKey } from "./ammo";
import { clothing, ClothingItemKey } from "./clothing";
import { ConsumableItemKey, consumables, isItemConsumable } from "./consumables";
import { ItemType } from "./item-type";
import { MaterialItemKey, materials } from "./materials";
import { getWeaponData, isItemWeapon, WeaponItemKey, weapons } from "./weapons";
export * from "./weapons";

export const ITEMS_REGISTRY = {
  ...weapons,
  ...ammo,
  ...clothing,
  ...consumables,
  ...materials,
} as const;

export type ItemKey =
  | WeaponItemKey
  | AmmoItemKey
  | ClothingItemKey
  | ConsumableItemKey
  | MaterialItemKey;
export type WeaponItemInfo = (typeof ITEMS_REGISTRY)[WeaponItemKey];
export type AmmoItemInfo = (typeof ITEMS_REGISTRY)[AmmoItemKey];
export type ClothingItemInfo = (typeof ITEMS_REGISTRY)[ClothingItemKey];
export type ConsumableItemInfo = (typeof ITEMS_REGISTRY)[ConsumableItemKey];
export type MaterialItemInfo = (typeof ITEMS_REGISTRY)[MaterialItemKey];
export type ItemInfo = (typeof ITEMS_REGISTRY)[ItemKey];

export type ItemTypeByKey = {
  [K in WeaponItemKey]: typeof ItemType.WEAPON;
} & {
  [K in AmmoItemKey]: typeof ItemType.AMMO;
} & {
  [K in ClothingItemKey]: typeof ItemType.CLOTHING;
} & {
  [K in ConsumableItemKey]: typeof ItemType.CONSUMABLE;
} & {
  [K in MaterialItemKey]: typeof ItemType.MATERIAL;
};

export function isValidItem(key: string): key is ItemKey {
  return key in ITEMS_REGISTRY;
}

export function isItemUsable(key: ItemKey) {
  return isItemConsumable(key);
}

export function isItemEquipable(key: ItemKey) {
  return isItemWeapon(key);
}

export function findItemByKey<K extends ItemKey>(key: K): (typeof ITEMS_REGISTRY)[K] {
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
    default:
      return item.name ?? "Unknown Item";
  }
}

export function getItemDescription(key: ItemKey) {
  return findItemByKey(key).description;
}

export function getItemData<T extends ItemData>(data: T) {
  return data[data.type] as T[typeof data.type];
}

export const ITEM_DATA_DEFAULTS = {
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
