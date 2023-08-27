import { EquipmentSlot } from "./equipment";

export type LocalInventoryItemSource = {
  type: "inventory";
  inventorySlot: number;
};

export type InventoryItemSource = LocalInventoryItemSource & {
  source: "character" | "vehicle";
  sourceId: any;
};

export type LocalEquipmentItemSource = {
  type: "equipment";
  equipmentSlot: EquipmentSlot;
};

export type EquipmentItemSource = LocalEquipmentItemSource & {
  source: "character";
  sourceId: any;
};

export type LocalItemSource = LocalInventoryItemSource | LocalEquipmentItemSource;
export type ItemSource = InventoryItemSource | EquipmentItemSource;
