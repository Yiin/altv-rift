import * as Prisma from "@prisma/client/edge";
import { Item, Equipment } from "@shared/modules/items";

type Override<A, B> = Omit<A, keyof B> & B;

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

export type Character = Override<
  Prisma.Character,
  {
    inventory: Inventory;
    equipment: Equipment;
  }
>;
