import { Inventory, ItemSourceOrigin, PlayerItemSource, StorageSource } from "@shared/interfaces";
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
  Shop = "Shop",
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
    | {
        type: StorageType.Shop;
        label: string;
        source: StorageSource;
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
    upgrading: {
      startedAt: number;
      recipe: BlueprintRecipe;
      itemSource: PlayerItemSource;
    } | null;
  };
}

export const getDefaultGameState = (): GameState => ({
  flags: new Set(),
  openedStorage: {
    type: StorageType.AirDrop,
    label: "Loot Box",
    inventory: {
      size: 10,
      items: [],
    },
    source: {
      originId: 1,
      origin: ItemSourceOrigin.Storage,
    },
    validUntil: Date.now() + 1000 * 60 * 60,
  },
  fishingProgress: null,
  workbench: {
    queue: [],
    startedAt: 0,
    upgrading: null,
  },
});
