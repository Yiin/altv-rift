import { type Equipment, type Item } from "@shared/modules/items";
import {
  type GroundItemSource,
  type StorageItemSource,
  type ItemSource,
  type PlayerEquipmentItemSource,
  type PlayerInventoryItemSource,
} from "@shared/interfaces";

export type Dragging = {
  item: SlottedItem;
  startPosition: {
    x: number;
    y: number;
  };
  currentPosition: {
    x: number;
    y: number;
  };
};

export type TransferingAmount = {
  item: SlottedItem;
  to?: ItemSource | null;
  resolve: (amount: number) => void;
  reject: () => void;
  position: {
    x: number;
    y: number;
  };
};

export type Hovering = {
  item: SlottedItem;
  position: {
    x: number;
    y: number;
  };
};

export type ItemActionMenu = {
  item: SlottedItem;
  x: number;
  y: number;
  ts: number;
};

export enum InventoryInteractionType {
  None = "None",
  Dragging = "Dragging",
  TransferingAmount = "TransferingAmount",
  Hovering = "Hovering",
  ContextMenu = "ContextMenu",
  AmmunitionPanel = "AmmunitionPanel",
}

export type ItemInteraction =
  | { type: InventoryInteractionType.None }
  | {
      type: InventoryInteractionType.Dragging;
      maybe: boolean;
      hidden?: boolean;
      state: Dragging;
    }
  | {
      type: InventoryInteractionType.TransferingAmount;
      state: TransferingAmount;
    }
  | {
      type: InventoryInteractionType.Hovering;
      state: Hovering;
    }
  | {
      type: InventoryInteractionType.ContextMenu;
      state: ItemActionMenu;
    }
  | {
      type: InventoryInteractionType.AmmunitionPanel;
    };

export type SlottedPlayerInventoryItem<T = Item> = {
  item: T;
  source: PlayerInventoryItemSource;
};

export type SlottedEquipmentItem<T = Item> = {
  item: T;
  source: PlayerEquipmentItemSource;
};

export type SlottedGroundItem<T = Item> = {
  item: T;
  source: GroundItemSource;
};

export type SlottedStorageItem<T = Item> = {
  item: T;
  source: StorageItemSource;
  price: number | null;
};

export type SlottedItem<S = ItemSource, T = Item> =
  // player inventory
  S extends PlayerInventoryItemSource
    ? SlottedPlayerInventoryItem<T>
    : // player equipment
      S extends PlayerEquipmentItemSource
      ? SlottedEquipmentItem<T>
      : // nearby items
        S extends GroundItemSource
        ? SlottedGroundItem<T>
        : // opened storage
          S extends StorageItemSource
          ? SlottedStorageItem<T>
          : never;

export type SlottedEquipment = {
  [K in keyof Equipment]: SlottedItem<PlayerEquipmentItemSource, NonNullable<Equipment[K]>> | null;
};

export type ItemNode = { source: ItemSource; node: { value: HTMLElement | undefined } };
