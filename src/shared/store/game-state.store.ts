import alt from "@altv/shared";
import { Inventory, StorageSource } from "@shared/interfaces";
import { Ammo } from "@shared/modules/items";

export enum PlayerFlags {
  InFishingArea = "InFishingArea",
  IsFishing = "IsFishing",
  InDiggingArea = "InDiggingArea",
  IsDigging = "IsDigging",
}

export enum StorageType {
  // Shop = "Shop",
  Storage = "Storage",
  AirDrop = "AirDrop",
  LootBox = "LootBox",
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
}

export const getDefaultGameState = (): GameState => ({
  flags: new Set(),
  openedStorage: null,
});
