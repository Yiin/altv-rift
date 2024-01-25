import { InventoryItem, InventorySource } from "@shared/interfaces";
import { Ammo, FirearmWeapon, ItemGrade } from "@shared/modules/items";

export enum PlayerFlags {
  InFishingArea = "InFishingArea",
  IsFishing = "IsFishing",
  InDiggingArea = "InDiggingArea",
  IsDigging = "IsDigging",
}

export interface GameState {
  flags: Set<PlayerFlags>;
  interaction: {
    source: InventorySource;
    isOwned: boolean;
    size: number;
    items: InventoryItem[];
  } | null;
}

export const getDefaultGameState = (): GameState => ({
  flags: new Set(),
  interaction: null && {
    source: {
      origin: "shop",
      originId: 1,
    },
    isOwned: false,
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
