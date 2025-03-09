import * as Prisma from "@prisma/client/edge";
import { Item, Equipment } from "@shared/modules/items";

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
    skills: Prisma.Character["skills"] & {
      foodDelivery: Override<Prisma.Character["skills"]["foodDelivery"], {
        stats: {
          totalDeliveries: number;
          successfulDeliveries: number;
          failedDeliveries: number;
          tipsReceived: number;
          totalEarnings: number;
          fastestDelivery: number;
          averageDeliveryTime: number;
          privateHomeDeliveries: number;
          regularDeliveries: number;
          lastDeliveryDate: number;
        };
      }>;
    };
  }
>;

export type User = Override<
  Prisma.User,
  {
    characters: Character[];
  }
>;

export type Shop = Override<
  Prisma.Shop,
  {
    inventory: Inventory;
    ped: OptionalNullable<Prisma.ShopPed>;
  }
>;
