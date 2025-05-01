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

export interface HomeDeliveryPoint {
  street: string;
  pos: alt.IVector3;
}

export type DeliveryPoint = alt.IVector3 | HomeDeliveryPoint;

export interface PlayerDelivery {
  id: number;
  collectionPoint: alt.IVector3;
  deliveryPoint: DeliveryPoint;
  isPrivateHome: boolean;
  timeLimit: number;
  startTime: number;
  bonus: number;
}

export interface DeliveryCollectionPoint {
  pos: alt.IVector3;
  isCollected: boolean;
  isNearby: boolean;
}

export interface FoodDeliveryData {
  activeDeliveries: PlayerDelivery[];
  collectionPoint: DeliveryCollectionPoint | null;
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
    activeDeliveries: [],
    collectionPoint: null,
  },
});
