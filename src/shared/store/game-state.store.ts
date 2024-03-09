import alt from "@altv/shared";
import { Inventory, StorageSource } from "@shared/interfaces";
import { FishBaitItemKey } from "@shared/modules/items";

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
  // HoldBalance = "HoldBalance",
  TimeClick = "TimeClick",
  Keys = "Keys",
}

export interface GameState {
  flags: Set<PlayerFlags>;
  openedStorage: {
    type: StorageType.Storage;
    label: string;
    source: StorageSource;
    inventory: Inventory;
  } | {
    type: StorageType.LootBox;
    label: string;
    source: StorageSource;
    validUntil: number;
    inventory: Inventory;
  } | {
    type: StorageType.AirDrop;
    label: string;
    source: StorageSource;
    validUntil: number;
    inventory: Inventory;
  } | null;
  fishingProgress:
  // | {
  //   baitKey: FishBaitItemKey;
  //   gameType: FishingGameType.HoldBalance;
  //   balance: number;
  // }
  | {
    baitKey: FishBaitItemKey;
    gameType: FishingGameType.TimeClick;
    startedAt: number;
    durationMs: number;
    targetPosition: number; // 0-1
    targetSize: number; // 0-1
  }
  | {
    baitKey: FishBaitItemKey;
    gameType: FishingGameType.Keys;
    startedAt: number;
    durationMs: number;
    keys: alt.Enums.KeyCode[];
    pressedKeys: alt.Enums.KeyCode[];
  } | null;
}

export const getDefaultGameState = (): GameState => ({
  flags: new Set(),
  openedStorage: null,
  fishingProgress: null,
});
