import { EquipmentSlot } from "./equipment";

export type LocalPlayerInventoryItemSource = {
  type: "inventory";
  inventorySlot: number;
};

export type InventorySource = {
  origin: "character" | "vehicle" | "shop" | "trade";
  originId: any;
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
export type LocalItemSource = LocalPlayerItemSource | InteractionInventoryItemSource;
export type ItemSource = InventoryItemSource | EquipmentItemSource;
