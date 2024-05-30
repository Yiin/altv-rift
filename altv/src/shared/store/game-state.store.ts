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

export type GenericStorage = {
  type: StorageType.Storage;
  label: string;
  source: StorageSource;
  inventory: Inventory;
};

export type LootBoxStorage = {
  type: StorageType.LootBox;
  label: string;
  source: StorageSource;
  validUntil: number;
  inventory: Inventory;
};

export type AirDropStorage = {
  type: StorageType.AirDrop;
  label: string;
  source: StorageSource;
  validUntil: number;
  inventory: Inventory;
};

export type ShopStorage = {
  type: StorageType.Shop;
  label: string;
  source: StorageSource;
  inventory: Inventory;
};

export interface GameState {
  flags: Set<PlayerFlags>;
  openedStorage: GenericStorage | LootBoxStorage | AirDropStorage | ShopStorage | null;
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
    type: StorageType.Shop,
    inventory: {
      size: 8,
      items: [],
    },
    label: "24/7 Grocery store",
    source: {
      origin: ItemSourceOrigin.Storage,
      originId: 0,
    },
  },
  fishingProgress: null,
  workbench: {
    queue: [],
    startedAt: 0,
    upgrading: null,
  },
});
