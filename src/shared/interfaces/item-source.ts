import { EquipmentSlot } from "./equipment";
import { Character } from "./prisma-overrides";

/**
 * Where is the item from?
 */
export enum ItemSourceOrigin {
  PlayerInventory = "PlayerInventory",
  PlayerEquipment = "PlayerEquipment",
  Ground = "Ground",
  InteractionInventory = "InteractionInventory",
}

/**
 * Source origin types
 */
export type PlayerInventorySource = {
  origin: ItemSourceOrigin.PlayerInventory;
  originId: Character['id'];
};

export type PlayerEquipmentSource = {
  origin: ItemSourceOrigin.PlayerEquipment;
  originId: Character['id'];
};

export type InteractionInventorySource = {
  origin: ItemSourceOrigin.InteractionInventory;
  originId: number; // VirtualEntity["id"]
};

export type InventorySource = PlayerInventorySource | InteractionInventorySource;

/**
 * Item source types
 */
export type PlayerInventoryItemSource = {
  inventorySlot: number;
} & PlayerInventorySource;

export type PlayerEquipmentItemSource = {
  equipmentSlot: EquipmentSlot;
} & PlayerEquipmentSource;

export type GroundItemSource = {
  origin: ItemSourceOrigin.Ground;
  originId: number; // VirtualEntity["id"]
};

export type InteractionInventoryItemSource = {
  inventorySlot: number;
} & InteractionInventorySource;

export type InventoryItemSource = PlayerInventoryItemSource | InteractionInventoryItemSource;

export type PlayerItemSource = PlayerInventoryItemSource | PlayerEquipmentItemSource;
export type ItemSource = PlayerInventoryItemSource | PlayerEquipmentItemSource | GroundItemSource | InteractionInventoryItemSource;
