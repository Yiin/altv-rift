import { Inventory, PlayerItemSource, StorageSource } from "@shared/interfaces";
import { FishingBaitItemKey } from "@shared/modules/items";
import { BlueprintRecipe } from "@shared/modules/production";
import alt from "@altv/shared";

export enum PlayerFlags {
  InFishingArea = "InFishingArea",
  IsFishing = "IsFishing",
  IsCatchingAFish = "IsCatchingAFish",
  InDiggingArea = "InDiggingArea",
  IsDigging = "IsDigging",
  HasActiveDelivery = "HasActiveDelivery",
  AcceptingDeliveries = "AcceptingDeliveries",
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

export interface PlayerDelivery {
  collectionPoint: alt.IVector3;
  deliveryPoint: alt.IVector3 & { name?: string };
  isPrivateHome: boolean;
  timeLimit: number;
  startTime: number;
  bonus: number;
  nextDeliveryTime: number;
  isCollected: boolean;
  status: "pending" | "collected" | "delivered" | "failed";
}

export interface FoodDeliveryData {
  activeDeliveries: Map<number, PlayerDelivery>;
  activeWaypoint?: {
    deliveryId: number;
    position: alt.IVector3;
    label: string;
    type: "collection" | "delivery";
    distance: number;
  };
  stats?: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    tipsReceived: number;
    totalEarnings: number;
    fastestDelivery: number; // in milliseconds
    averageDeliveryTime: number; // in milliseconds
    privateHomeDeliveries: number;
    regularDeliveries: number;
    lastDeliveryDate: number;
  };
}

export interface GameState {
  flags: Set<PlayerFlags>;
  openedStorage: GenericStorage | LootBoxStorage | AirDropStorage | ShopStorage | null;
  fishingProgress: {
    baitKey: FishingBaitItemKey;
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
  foodDelivery: FoodDeliveryData;
}

export const getDefaultGameState = (): GameState => ({
  flags: new Set(),
  openedStorage: null,
  fishingProgress: null,
  workbench: {
    queue: [],
    startedAt: 0,
    upgrading: null,
  },
  foodDelivery: {
    activeDeliveries: new Map(),
  },
});
