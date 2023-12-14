import { InventoryItem, InventorySource } from "@shared/interfaces";
import { FirearmWeapon, ItemGrade } from "@shared/modules/items";

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
  interaction: {
    source: {
      origin: "shop",
      originId: 1,
    },
    isOwned: true,
    size: 10,
    items: [
      {
        item: {
          key: FirearmWeapon.HEAVYSNIPER,
          durability: 100,
          tier: ItemGrade.A,
          components: [],
          tint: 0,
        },
        slot: 0,
      },
    ],
  },
});
