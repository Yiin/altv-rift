import { InventoryItemSource } from "@shared/interfaces";
import {
  addItemToInventory,
  getInventoryItemInSlot,
  removeItemFromInventorySlot,
} from "@shared/modules/inventory";
import { createItem, isStackable } from "@shared/modules/items";
import { findInventoryByItemSource } from "./find-inventory-by-item-source";

export function swapInventoryItems(
  from: InventoryItemSource,
  to: InventoryItemSource,
  amount = 1,
): boolean {
  const fromInventory = findInventoryByItemSource(from);
  const toInventory = findInventoryByItemSource(to);

  if (!fromInventory || !toInventory) {
    console.log("Failed to find inventories", fromInventory, toInventory);
    return false;
  }

  const fromItem = getInventoryItemInSlot(fromInventory, from.inventorySlot);
  const toItem = getInventoryItemInSlot(toInventory, to.inventorySlot);

  if (fromItem && toItem) {
    if (fromInventory === toInventory) {
      [fromItem.slot, toItem.slot] = [toItem.slot, fromItem.slot];
    } else {
      if (isStackable(fromItem.item) && amount < fromItem.item.amount) {
        const newItem = createItem(fromItem.item.key, { ...fromItem.item, amount });
        fromItem.item.amount -= amount;
        addItemToInventory(toInventory, newItem, to.inventorySlot);
      } else {
        [fromItem.item, toItem.item] = [toItem.item, fromItem.item];
      }
    }
    return true;
  } else if (fromItem) {
    if (fromInventory === toInventory) {
      fromItem.slot = to.inventorySlot;
    } else {
      if (isStackable(fromItem.item) && amount < fromItem.item.amount) {
        const newItem = createItem(fromItem.item.key, { ...fromItem.item, amount });
        fromItem.item.amount -= amount;
        addItemToInventory(toInventory, newItem, to.inventorySlot);
      } else {
        addItemToInventory(toInventory, fromItem.item, to.inventorySlot);
        removeItemFromInventorySlot(fromInventory, from.inventorySlot);
      }
    }
    return true;
  } else if (toItem) {
    if (fromInventory === toInventory) {
      toItem.slot = from.inventorySlot;
    } else {
      if (isStackable(toItem.item) && amount < toItem.item.amount) {
        const newItem = createItem(toItem.item.key, { ...toItem.item, amount });
        toItem.item.amount -= amount;
        addItemToInventory(fromInventory, newItem, from.inventorySlot);
      } else {
        addItemToInventory(fromInventory, toItem.item, from.inventorySlot);
        removeItemFromInventorySlot(toInventory, to.inventorySlot);
      }
    }
    return true;
  }

  console.log("Failed to find items");
  return false;
}
