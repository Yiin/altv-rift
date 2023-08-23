import * as Prisma from "@prisma/client";
import { ItemKey, ITEMS_REGISTRY, WeaponItemKey } from "@shared/modules/items";
import { AmmoItemKey } from "@shared/modules/items/ammo";
import { ClothingItemKey } from "@shared/modules/items/clothing";
import { ConsumableItemKey } from "@shared/modules/items/consumables";
import { MaterialItemKey } from "@shared/modules/items/materials";

type Override<A, B> = Omit<A, keyof B> & B;
type NullableKeys<T> = {
  [K in keyof T]: UnionToIntersection<T[K]> extends null
    ? K
    : UnionToIntersection<T[K]> extends Array<any>
    ? K
    : never;
}[keyof T];
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type OptionalNullable<T> = Optional<T, NullableKeys<T>>;

export type EquipedAmmo = Override<
  Prisma.EquipedAmmo,
  {
    key: AmmoItemKey;
  }
>;
export type FirearmWeaponItemData = OptionalNullable<
  Override<
    Prisma.FirearmWeaponItem,
    {
      ammo?: EquipedAmmo | null;
    }
  >
>;
export type ThrowableWeaponItemData = OptionalNullable<Prisma.ThrowableWeaponItem>;
export type MeleeWeaponItemData = OptionalNullable<Prisma.MeleeWeaponItem>;
export type AmmoItemData = OptionalNullable<Prisma.AmmoItem>;
export type ClothingItemData = OptionalNullable<Prisma.ClothingItem>;
export type ConsumableItemData = OptionalNullable<Prisma.ConsumableItem>;
export type MaterialItemData = OptionalNullable<Prisma.MaterialItem>;

type DefaultItem = {
  [Prisma.ItemType.FIREARM_WEAPON]: never;
  [Prisma.ItemType.THROWABLE_WEAPON]: never;
  [Prisma.ItemType.MELEE_WEAPON]: never;
  [Prisma.ItemType.AMMO]: never;
  [Prisma.ItemType.CLOTHING]: never;
  [Prisma.ItemType.CONSUMABLE]: never;
  [Prisma.ItemType.MATERIAL]: never;
};

export type FirearmWeaponItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.FIREARM_WEAPON;
    key: WeaponItemKey;
    [Prisma.ItemType.FIREARM_WEAPON]: FirearmWeaponItemData;
  }
>;

export type ThrowableWeaponItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.THROWABLE_WEAPON;
    key: WeaponItemKey;
    [Prisma.ItemType.THROWABLE_WEAPON]: ThrowableWeaponItemData;
  }
>;

export type MeleeWeaponItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.MELEE_WEAPON;
    key: WeaponItemKey;
    [Prisma.ItemType.MELEE_WEAPON]?: MeleeWeaponItemData;
  }
>;

export type AmmoItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.AMMO;
    key: AmmoItemKey;
    [Prisma.ItemType.AMMO]: AmmoItemData;
  }
>;

export type ClothingItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.CLOTHING;
    key: ClothingItemKey;
    [Prisma.ItemType.CLOTHING]: ClothingItemData;
  }
>;

export type ConsumableItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.CONSUMABLE;
    key: ConsumableItemKey;
    [Prisma.ItemType.CONSUMABLE]: ConsumableItemData;
  }
>;

export type MaterialItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.MATERIAL;
    key: MaterialItemKey;
    [Prisma.ItemType.MATERIAL]: MaterialItemData;
  }
>;

export type Item =
  | FirearmWeaponItem
  | ThrowableWeaponItem
  | MeleeWeaponItem
  | AmmoItem
  | ClothingItem
  | ConsumableItem
  | MaterialItem;

export type ItemData =
  | FirearmWeaponItemData
  | ThrowableWeaponItemData
  | MeleeWeaponItemData
  | AmmoItemData
  | ClothingItemData
  | ConsumableItemData
  | MaterialItemData;

export type InventoryItem<T extends Item = Item> = Override<
  Prisma.InventoryItem,
  {
    data: T;
  }
>;

export type Inventory = Override<
  Prisma.Inventory,
  {
    items: InventoryItem[];
  }
>;

export type Equipment = {
  [key in keyof Prisma.Equipment]?: Item | null;
};

export type Character = Override<
  Prisma.Character,
  {
    inventory: Inventory;
    equipment: Equipment;
  }
>;

export type ItemTypeToItemMap = {
  [Prisma.ItemType.FIREARM_WEAPON]: FirearmWeaponItem;
  [Prisma.ItemType.THROWABLE_WEAPON]: ThrowableWeaponItem;
  [Prisma.ItemType.MELEE_WEAPON]: MeleeWeaponItem;
  [Prisma.ItemType.AMMO]: AmmoItem;
  [Prisma.ItemType.CLOTHING]: ClothingItem;
  [Prisma.ItemType.CONSUMABLE]: ConsumableItem;
  [Prisma.ItemType.MATERIAL]: MaterialItem;
};

export type ItemTypeToItemDataMap = {
  [Prisma.ItemType.FIREARM_WEAPON]: FirearmWeaponItemData;
  [Prisma.ItemType.THROWABLE_WEAPON]: ThrowableWeaponItemData;
  [Prisma.ItemType.MELEE_WEAPON]: MeleeWeaponItemData;
  [Prisma.ItemType.AMMO]: AmmoItemData;
  [Prisma.ItemType.CLOTHING]: ClothingItemData;
  [Prisma.ItemType.CONSUMABLE]: ConsumableItemData;
  [Prisma.ItemType.MATERIAL]: MaterialItemData;
};

export type ItemTypeByKey<K extends ItemKey> = (typeof ITEMS_REGISTRY)[K]["itemType"];
export type ItemDataByKey<K extends ItemKey> = ItemTypeToItemDataMap[ItemTypeByKey<K>];
export type ItemByKey<K extends ItemKey> = ItemTypeToItemMap[ItemTypeByKey<K>];
