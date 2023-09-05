import * as Prisma from "@prisma/client/edge";
import { ItemKey, ITEMS_REGISTRY } from "@shared/modules/items";
import { FirearmWeaponItemKey } from "@shared/modules/items/weapons/firearms";
import { ThrowableWeaponItemKey } from "@shared/modules/items/weapons/throwable";
import { MeleeWeaponItemKey } from "@shared/modules/items/weapons/melee";
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
    clip: AmmoItemData;
    rest: AmmoItemData;
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
export type BasicItemData = OptionalNullable<Prisma.BasicItem>;

type DefaultItem = {
  [Prisma.ItemType.FIREARM_WEAPON]?: never;
  [Prisma.ItemType.THROWABLE_WEAPON]?: never;
  [Prisma.ItemType.MELEE_WEAPON]?: never;
  [Prisma.ItemType.AMMO]?: never;
  [Prisma.ItemType.CLOTHING]?: never;
  [Prisma.ItemType.CONSUMABLE]?: never;
  [Prisma.ItemType.MATERIAL]?: never;
  [Prisma.ItemType.BASIC]?: never;
};

export type FirearmWeaponItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.FIREARM_WEAPON;
    key: FirearmWeaponItemKey;
    [Prisma.ItemType.FIREARM_WEAPON]: FirearmWeaponItemData;
  }
>;

export type ThrowableWeaponItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.THROWABLE_WEAPON;
    key: ThrowableWeaponItemKey;
    [Prisma.ItemType.THROWABLE_WEAPON]: ThrowableWeaponItemData;
  }
>;

export type MeleeWeaponItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.MELEE_WEAPON;
    key: MeleeWeaponItemKey;
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

export type BasicItem = Override<
  DefaultItem,
  {
    type: typeof Prisma.ItemType.BASIC;
    key: BasicItemKey;
    [Prisma.ItemType.BASIC]: BasicItemData;
  }
>;

export type Item =
  | FirearmWeaponItem
  | ThrowableWeaponItem
  | MeleeWeaponItem
  | AmmoItem
  | ClothingItem
  | ConsumableItem
  | MaterialItem
  | BasicItem;

export type ItemData =
  | FirearmWeaponItemData
  | ThrowableWeaponItemData
  | MeleeWeaponItemData
  | AmmoItemData
  | ClothingItemData
  | ConsumableItemData
  | MaterialItemData
  | BasicItemData;

export type InventoryItem<T = Item> = Override<
  Prisma.InventoryItem,
  {
    item: T;
  }
>;

export type Inventory = Override<
  Prisma.Inventory,
  {
    items: InventoryItem[];
  }
>;

export type Equipment = {
  mask?: ClothingItem | null;
  glasses?: ClothingItem | null;
  headwear?: ClothingItem | null;
  earrings?: ClothingItem | null;
  top?: ClothingItem | null;
  shirt?: ClothingItem | null;
  armor?: ClothingItem | null;
  neckwear?: ClothingItem | null;
  weapon?: FirearmWeaponItem | ThrowableWeaponItem | MeleeWeaponItem | null;
  gloves?: ClothingItem | null;
  lefthand?: ClothingItem | null;
  pants?: ClothingItem | null;
  righthand?: ClothingItem | null;
  backpack?: null;
  shoes?: ClothingItem | null;
  phone?: null;
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
  [Prisma.ItemType.BASIC]: BasicItem;
};

export type ItemTypeToItemDataMap = {
  [Prisma.ItemType.FIREARM_WEAPON]: FirearmWeaponItemData;
  [Prisma.ItemType.THROWABLE_WEAPON]: ThrowableWeaponItemData;
  [Prisma.ItemType.MELEE_WEAPON]: MeleeWeaponItemData;
  [Prisma.ItemType.AMMO]: AmmoItemData;
  [Prisma.ItemType.CLOTHING]: ClothingItemData;
  [Prisma.ItemType.CONSUMABLE]: ConsumableItemData;
  [Prisma.ItemType.MATERIAL]: MaterialItemData;
  [Prisma.ItemType.BASIC]: BasicItemData;
};

export type ItemTypeByKey<K extends ItemKey> = (typeof ITEMS_REGISTRY)[K]["itemType"];
export type ItemDataByKey<K extends ItemKey> = ItemTypeToItemDataMap[ItemTypeByKey<K>];
export type ItemByKey<K extends ItemKey> = ItemTypeToItemMap[ItemTypeByKey<K>];
