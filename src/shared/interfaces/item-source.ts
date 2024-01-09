import { EquipmentSlot } from "./equipment";

export type LocalPlayerInventoryItemSource = {
  type: "inventory";
  inventorySlot: number;
};

export type InventorySource = {
  origin: "character" | "vehicle" | "shop" | "trade" | "storage";
  originId: any;
};

export type ShopSource = {
  origin: "shop";
  originId: string;
};

export type StorageSource = {
  origin: "storage";
  originId: string;
};

export type InventoryItemSource = LocalPlayerInventoryItemSource & InventorySource;

export type LocalPlayerEquipmentItemSource = {
  type: "equipment";
  equipmentSlot: EquipmentSlot;
};

export type EquipmentItemSource = LocalPlayerEquipmentItemSource & {
  origin: "character";
  originId: any;
};

export type InteractionInventoryItemSource = {
  type: "interaction";
  inventorySlot: number;
};

export type LocalPlayerItemSource = LocalPlayerInventoryItemSource | LocalPlayerEquipmentItemSource;
export type LocalInventoryItemSource = LocalPlayerInventoryItemSource | InteractionInventoryItemSource;
export type LocalItemSource = LocalInventoryItemSource | LocalPlayerEquipmentItemSource;
export type ItemSource = InventoryItemSource | EquipmentItemSource;
