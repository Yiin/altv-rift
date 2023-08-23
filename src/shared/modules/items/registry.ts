import { ItemType } from "@prisma/client";
import {
  Item,
  AmmoItemData,
  ClothingItemData,
  FirearmWeaponItemData,
  ThrowableWeaponItemData,
  MeleeWeaponItemData,
  MaterialItemData,
  ConsumableItemData,
  ItemDataByKey,
  Override,
  ItemByKey,
  ItemData,
  InventoryItem,
} from "../../interfaces";
import { ammo, AmmoItemKey } from "./ammo";
import { clothing, ClothingItemKey } from "./clothing";
import { ConsumableItemKey, consumables, isItemConsumable } from "./consumables";
import { MaterialItemKey, materials } from "./materials";
import { getWeaponData, isItemWeapon, WeaponItemKey, weapons } from "./weapons";
import { FirearmWeaponItemKey } from "./weapons/firearms";
import { MeleeWeaponItemKey } from "./weapons/melee";
import { ThrowableWeaponItemKey } from "./weapons/throwable";

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

export type AmmoItemInfo = (typeof ITEMS_REGISTRY)[AmmoItemKey];
export type ClothingItemInfo = (typeof ITEMS_REGISTRY)[ClothingItemKey];
export type ConsumableItemInfo = (typeof ITEMS_REGISTRY)[ConsumableItemKey];
export type MaterialItemInfo = (typeof ITEMS_REGISTRY)[MaterialItemKey];
export type ItemInfo = (typeof ITEMS_REGISTRY)[ItemKey];

export type ItemTypeByKey = {
  [K in FirearmWeaponItemKey]: typeof ItemType.FIREARM_WEAPON;
} & {
  [K in ThrowableWeaponItemKey]: typeof ItemType.THROWABLE_WEAPON;
} & {
  [K in MeleeWeaponItemKey]: typeof ItemType.MELEE_WEAPON;
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

export function getItemData<T extends Item>(item: T) {
  return item[item.type] as T[T["type"]];
}

export function isStackable<T extends ItemData>(data?: T): data is T & { amount: number } {
  return !!(data && "amount" in data);
}

export function getItemEquipmentSlot(inventoryItem: InventoryItem) {
  switch (inventoryItem.data.type) {
    case ItemType.FIREARM_WEAPON:
    case ItemType.THROWABLE_WEAPON:
    case ItemType.MELEE_WEAPON:
      return "weapon";
    case ItemType.CLOTHING:
      const itemInfo = getItemInfoByKey(inventoryItem.data.key);
      return itemInfo.equipmentSlot;
  }
  return;
}

export function createItem<T extends ItemKey, D = ItemDataByKey<T>>(
  key: T,
  data?: Override<D, (typeof ITEM_DATA_DEFAULTS)[ItemTypeByKey[T]]>
) {
  const type = getItemType(key);

  return {
    key,
    type,
    [type]: {
      ...ITEM_DATA_DEFAULTS[type],
      ...data,
    },
  } as any as ItemByKey<T>;
}

export const ITEM_DATA_DEFAULTS = {
  [ItemType.FIREARM_WEAPON]: {
    durability: 100,
    customName: null,
    ammo: null,
    components: [],
    tint: 0,
  } satisfies Partial<FirearmWeaponItemData>,
  [ItemType.THROWABLE_WEAPON]: {} satisfies Partial<ThrowableWeaponItemData>,
  [ItemType.MELEE_WEAPON]: {
    durability: 100,
    customName: null,
    components: [],
    tint: 0,
  } satisfies Partial<MeleeWeaponItemData>,
  [ItemType.AMMO]: {} satisfies Partial<AmmoItemData>,
  [ItemType.CLOTHING]: {
    durability: 100,
    customName: null,
    texture: 0,
  } satisfies Partial<ClothingItemData>,
  [ItemType.CONSUMABLE]: {} satisfies Partial<ConsumableItemData>,
  [ItemType.MATERIAL]: {} satisfies Partial<MaterialItemData>,
} as const;
