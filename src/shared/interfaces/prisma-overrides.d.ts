import {
  WeaponItem as PrismaWeaponItem,
  AmmoItem as PrismaAmmoItem,
  ClothingItem as PrismaClothingItem,
  InventoryItem as PrismaInventoryItem,
  Inventory as PrismaInventory,
  Character as PrismaCharacter,
} from "@prisma/client";
import { ITEMS_REGISTRY, WeaponItemKey } from "@shared/data/items";
import { AmmoItemKey } from "@shared/data/items/ammo";
import { ClothingItemKey } from "@shared/data/items/clothing";
import type { ItemType } from "@shared/data/items/item-types";

// export type EquipedAmmo = Omit<PrismaClient.EquipedAmmo, "ammo"> & {
//   ammo: AmmoItemData;
// };

type NullableKeys<T> = {
  [K in keyof T]: UnionToIntersection<T[K]> extends null
    ? K
    : UnionToIntersection<T[K]> extends Array<any>
    ? K
    : never;
}[keyof T];

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type OptionalNullable<T> = Optional<T, NullableKeys<T>>;

export type WeaponItem = OptionalNullable<PrismaWeaponItem>;
export type AmmoItem = OptionalNullable<PrismaAmmoItem>;
export type ClothingItem = OptionalNullable<PrismaClothingItem>;

export type WeaponItemData = {
  type: typeof ItemType.WEAPON;
  key: WeaponItemKey;
  [ItemType.WEAPON]: WeaponItem;
  [ItemType.AMMO]?: null;
  [ItemType.CLOTHING]?: null;
};

export type AmmoItemData = {
  type: typeof ItemType.AMMO;
  key: AmmoItemKey;
  [ItemType.WEAPON]?: null;
  [ItemType.AMMO]: AmmoItem;
  [ItemType.CLOTHING]?: null;
};

export type ClothingItemData = {
  type: typeof ItemType.CLOTHING;
  key: ClothingItemKey;
  [ItemType.WEAPON]?: null;
  [ItemType.AMMO]?: null;
  [ItemType.CLOTHING]: ClothingItem;
};

export type ItemData = WeaponItemData | AmmoItemData | ClothingItemData;

export type InventoryItem<T = ItemData> = Omit<PrismaInventoryItem, "data"> & {
  data: T;
};

export type Inventory = Omit<PrismaInventory, "items"> & {
  items: InventoryItem[];
};

export type Character = Omit<PrismaCharacter, "inventory"> & {
  inventory: Inventory;
};

export type ItemTypeData = {
  [ItemType.WEAPON]: WeaponItem;
  [ItemType.AMMO]: AmmoItem;
  [ItemType.CLOTHING]: ClothingItem;
};

export type ItemTypeByKey<K extends keyof typeof ITEMS_REGISTRY> =
  (typeof ITEMS_REGISTRY)[K]["itemType"];

export type ItemDataByKey<K extends keyof typeof ITEMS_REGISTRY> =
  ItemTypeData[ItemTypeByKey<K>];
