import { EquipmentSlot } from "./equipment";
import { Character } from "./prisma-overrides";

/**
 * Where is the item from?
 */
export enum ItemSourceOrigin {
  PlayerInventory = "PlayerInventory",
  PlayerEquipment = "PlayerEquipment",
  Storage = "Storage",
  Ground = "Ground",
}

/**
 * Source origin types
 */
export type PlayerInventorySource = {
  origin: ItemSourceOrigin.PlayerInventory;
  originId: Character["id"];
};

export type PlayerEquipmentSource = {
  origin: ItemSourceOrigin.PlayerEquipment;
  originId: Character["id"];
};

export type StorageSource = {
  origin: ItemSourceOrigin.Storage;
  originId: number; // VirtualEntity["id"]
};

export type InventorySource = PlayerInventorySource | StorageSource;

/**
 * Item source types
 */
export type PlayerInventoryItemSource = {
  inventorySlot: number;
} & PlayerInventorySource;

export type PlayerEquipmentItemSource = {
  equipmentSlot: EquipmentSlot;
} & PlayerEquipmentSource;

export type StorageItemSource = {
  inventorySlot: number;
} & StorageSource;

export type GroundItemSource = {
  origin: ItemSourceOrigin.Ground;
  originId: number; // VirtualEntity["id"]
};

export type InventoryItemSource = PlayerInventoryItemSource | StorageItemSource;

export type PlayerItemSource = PlayerInventoryItemSource | PlayerEquipmentItemSource;
export type ItemSource =
  | PlayerInventoryItemSource
  | PlayerEquipmentItemSource
  | GroundItemSource
  | StorageItemSource;
