import { EquipmentSlot } from "./equipment";

export enum ItemSourceType {
  PlayerInventory = "PlayerInventory",
  PlayerEquipment = "PlayerEquipment",
  InteractionInventory = "InteractionInventory",
  Global = "Global",
}

export enum ItemSourceOrigin {
  Character = "Character",
  Vehicle = "Vehicle",
  Shop = "Shop",
  Trade = "Trade",
  Storage = "Storage",
  Global = "Global",
}

export type LocalPlayerInventoryItemSource = {
  type: ItemSourceType.PlayerInventory;
  inventorySlot: number;
};

export type InventorySource = {
  origin: Exclude<ItemSourceOrigin, ItemSourceOrigin.Global>;
  originId: any;
};

export type ShopSource = {
  origin: ItemSourceOrigin.Shop;
  originId: string;
};

export type StorageSource = {
  origin: ItemSourceOrigin.Storage;
  originId: string;
};

export type GlobalItemSource = {
  origin: ItemSourceOrigin.Global;
  originId: number; // VirtualEntity["id"]
};

export type InventoryItemSource = LocalPlayerInventoryItemSource & InventorySource;

export type LocalPlayerEquipmentItemSource = {
  type: ItemSourceType.PlayerEquipment;
  equipmentSlot: EquipmentSlot;
};

export type EquipmentItemSource = LocalPlayerEquipmentItemSource & {
  origin: ItemSourceOrigin.Character;
  originId: any;
};

export type InteractionInventoryItemSource = {
  type: ItemSourceType.InteractionInventory;
  inventorySlot: number;
};

export type LocalGlobalItemSource = {
  type: ItemSourceType.Global;
  inventorySlot: number;
  originId: GlobalItemSource["originId"];
};

export type LocalPlayerItemSource = LocalPlayerInventoryItemSource | LocalPlayerEquipmentItemSource;
export type LocalInventoryItemSource = LocalPlayerInventoryItemSource | InteractionInventoryItemSource | LocalGlobalItemSource;
export type LocalItemSource = LocalInventoryItemSource | LocalPlayerEquipmentItemSource;
export type PlayerItemSource = InventoryItemSource | EquipmentItemSource;
export type ItemSource = PlayerItemSource | GlobalItemSource;
