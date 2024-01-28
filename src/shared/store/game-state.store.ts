import { InventoryItem, InteractionInventorySource } from "@shared/interfaces";
import { Ammo, FirearmWeapon, ItemGrade } from "@shared/modules/items";

export enum PlayerFlags {
  InFishingArea = "InFishingArea",
  IsFishing = "IsFishing",
  InDiggingArea = "InDiggingArea",
  IsDigging = "IsDigging",
}

export enum InteractionInventoryType {
  Shop = "Shop",
  Storage = "Storage",
}

export interface GameState {
  flags: Set<PlayerFlags>;
  interactionInventory: {
    type: InteractionInventoryType;
    label: string;
    source: InteractionInventorySource;
    size: number;
    items: InventoryItem[];
  } | null;
}

export const getDefaultGameState = (): GameState => ({
  flags: new Set(),
  interactionInventory: null && {
    type: InteractionInventoryType.Shop,
    label: "Grocery Shop",
    source: {
      origin: "shop",
      originId: 1,
    },
    size: 10,
    items: [
      {
        item: {
          key: Ammo.ASSAULT_RIFLE_AMMO,
          amount: 100000
        },
        slot: 0,
        price: 20,
      },
    ],
  },
});
