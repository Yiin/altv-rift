import alt from "@altv/shared";
import { Inventory, StorageSource } from "@shared/interfaces";
import { FishBaitItemKey } from "@shared/modules/items";
import { BlueprintRecipe } from "@shared/modules/production";

export enum PlayerFlags {
  InFishingArea = "InFishingArea",
  IsFishing = "IsFishing",
  IsCatchingAFish = "IsCatchingAFish",
  InDiggingArea = "InDiggingArea",
  IsDigging = "IsDigging",
}

export enum StorageType {
  // Shop = "Shop",
  Storage = "Storage",
  AirDrop = "AirDrop",
  LootBox = "LootBox",
}

export enum FishingGameType {
  TimeClick = "TimeClick",
}

export interface GameState {
  flags: Set<PlayerFlags>;
  openedStorage:
    | {
        type: StorageType.Storage;
        label: string;
        source: StorageSource;
        inventory: Inventory;
      }
    | {
        type: StorageType.LootBox;
        label: string;
        source: StorageSource;
        validUntil: number;
        inventory: Inventory;
      }
    | {
        type: StorageType.AirDrop;
        label: string;
        source: StorageSource;
        validUntil: number;
        inventory: Inventory;
      }
    | null;
  fishingProgress: {
    baitKey: FishBaitItemKey;
    gameType: FishingGameType.TimeClick;
    startedAt: number;
    durationMs: number;
    targetPosition: number; // 0-1
    targetSize: number; // 0-1
  } | null;
  workbench: {
    queue: BlueprintRecipe[];
    startedAt: number;
  };
}

export const getDefaultGameState = (): GameState => ({
  flags: new Set(),
  openedStorage: null,
  fishingProgress: null,
  workbench: {
    queue: [],
    startedAt: 0,
  },
});
