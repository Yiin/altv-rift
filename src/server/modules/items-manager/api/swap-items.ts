import { InventoryItemSource } from "@shared/interfaces";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { addItemToInventory } from "./add-item-to-inventory";
import { findInventoryByItemSource } from "./find-inventory-by-item-source";

export function swapInventoryItems(from: InventoryItemSource, to: InventoryItemSource): boolean {
  const fromInventory = findInventoryByItemSource(from);
  const toInventory = findInventoryByItemSource(to);

  if (!fromInventory || !toInventory) {
    return false;
  }

  const fromItem = getInventoryItemInSlot(fromInventory, from.inventorySlot);
  const toItem = getInventoryItemInSlot(toInventory, to.inventorySlot);

  if (fromItem && toItem) {
    if (fromInventory === toInventory) {
      [fromItem.slot, toItem.slot] = [toItem.slot, fromItem.slot];
    } else {
      [fromItem.item, toItem.item] = [toItem.item, fromItem.item];
    }
  } else if (fromItem) {
    if (fromInventory === toInventory) {
      fromItem.slot = to.inventorySlot;
    } else {
      addItemToInventory(toInventory, fromItem.item, to.inventorySlot);
    }
  } else if (toItem) {
    if (fromInventory === toInventory) {
      toItem.slot = from.inventorySlot;
    } else {
      addItemToInventory(fromInventory, toItem.item, from.inventorySlot);
    }
  }

  return true;
}
