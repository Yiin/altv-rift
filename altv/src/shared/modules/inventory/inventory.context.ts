/**
 * The inventory context provides a way to handle inventory-specific events in a platform-agnostic way.
 *
 * Problem:
 * The shared inventory module needs to provide feedback when operations fail (e.g., "inventory full"),
 * but it can't directly show notifications because:
 * 1. Only server should show notifications, but the inventory module is shared between server and client
 * 2. The inventory module should not have any dependencies on the player object
 *
 * Solution:
 * This context system allows the consuming code (server/client) to provide their own
 * notification handlers without the inventory module needing to know about the specific
 * implementation.
 */

import { Inventory } from "@shared/interfaces";
import { Item } from "../items";

type Unsubscribe = () => void;

type InventoryContext = {
  onInventoryItemAdd?: ((inventory: Inventory, item: Item) => void)[];
  onInventoryItemRemove?: ((inventory: Inventory, item: Item) => void)[];
  onInventoryFull?: ((inventory: Inventory) => void)[];
};

export enum InventoryEvents {
  INVENTORY_FULL = "inventory:full",
  INVENTORY_ITEM_ADD = "inventory:item:add",
  INVENTORY_ITEM_REMOVE = "inventory:item:remove",
}

export let inventoryContext: InventoryContext = {};

export function useInventoryContext() {
  return {
    onInventoryFull: (callback: (inventory: Inventory) => void): Unsubscribe => {
      if (!inventoryContext.onInventoryFull) {
        inventoryContext.onInventoryFull = [];
      }
      inventoryContext.onInventoryFull.push(callback);

      return () => {
        inventoryContext.onInventoryFull = inventoryContext.onInventoryFull?.filter(
          (cb) => cb !== callback,
        );
      };
    },
    onInventoryItemAdd: (callback: (inventory: Inventory, item: Item) => void): Unsubscribe => {
      if (!inventoryContext.onInventoryItemAdd) {
        inventoryContext.onInventoryItemAdd = [];
      }
      inventoryContext.onInventoryItemAdd.push(callback);

      return () => {
        inventoryContext.onInventoryItemAdd = inventoryContext.onInventoryItemAdd?.filter(
          (cb) => cb !== callback,
        );
      };
    },
    onInventoryItemRemove: (callback: (inventory: Inventory, item: Item) => void): Unsubscribe => {
      if (!inventoryContext.onInventoryItemRemove) {
        inventoryContext.onInventoryItemRemove = [];
      }
      inventoryContext.onInventoryItemRemove.push(callback);

      return () => {
        inventoryContext.onInventoryItemRemove = inventoryContext.onInventoryItemRemove?.filter(
          (cb) => cb !== callback,
        );
      };
    },
  };
}

export function emitInventoryEvent(
  event: InventoryEvents.INVENTORY_FULL,
  inventory: Inventory,
): void;
export function emitInventoryEvent(
  event: InventoryEvents.INVENTORY_ITEM_ADD,
  inventory: Inventory,
  item: Item,
): void;
export function emitInventoryEvent(
  event: InventoryEvents.INVENTORY_ITEM_REMOVE,
  inventory: Inventory,
  item: Item,
): void;
export function emitInventoryEvent(
  event: InventoryEvents,
  inventory: Inventory,
  item?: Item,
): void {
  switch (event) {
    case InventoryEvents.INVENTORY_FULL:
      inventoryContext.onInventoryFull?.forEach((cb) => cb(inventory));
      break;
    case InventoryEvents.INVENTORY_ITEM_ADD:
      inventoryContext.onInventoryItemAdd?.forEach((cb) => cb(inventory, item!));
      break;
    case InventoryEvents.INVENTORY_ITEM_REMOVE:
      inventoryContext.onInventoryItemRemove?.forEach((cb) => cb(inventory, item!));
      break;
  }
}
