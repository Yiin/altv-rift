import * as Prisma from "@prisma/client/edge";
import { ClothingItem, ItemKey } from "@shared/modules/items";
import { FirearmWeaponItem } from "@shared/modules/items/weapons/firearms";
import { MeleeWeaponItem } from "@shared/modules/items/weapons/melee";
import { ThrowableWeaponItem } from "@shared/modules/items/weapons/throwable";

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

export interface Item {
  key: ItemKey;
}

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
