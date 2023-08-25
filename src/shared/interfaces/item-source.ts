import { EquipmentSlot } from "./equipment";

export type InventorySource = {
  type: "inventory";
  inventorySlot: number;
};

export type EquipmentSource = {
  type: "equipment";
  equipmentSlot: EquipmentSlot;
};

export type ItemSource = InventorySource | EquipmentSource;
