import alt from "@altv/server";
import { toRaw } from "vue";
import { isEqual } from "lodash";
import { Inventory, InventoryItemSource } from "@shared/interfaces";
import { Item, createItem, isStackable } from "@shared/modules/items";
import { findSourceInventory } from "./hooks";

export function getInventoryItemInSlot(inventory: Inventory, slot: number) {
  return inventory.items.find((item) => item.slot === slot);
}

export function getInventoryItem(inventory: Inventory, item: Item) {
  return inventory.items.find((inventoryItem) => isEqual(inventoryItem.item, item));
}

export function getInventoryItemByKey(inventory: Inventory, key: string) {
  return inventory.items.find((item) => item.item.key === key);
}

export function removeItem(source: InventoryItemSource, amount = 0): Item | null {
  const inventory = findSourceInventory.call(source);

  if (!inventory) {
    return null;
  }

  return removeItemFromInventorySlot(inventory, source.inventorySlot, amount);
}

export function removeItemFromInventory(inventory: Inventory, item: Item, amount = 0): Item | null {
  const inventoryItem = getInventoryItem(inventory, item);

  if (!inventoryItem) {
    return null;
  }

  return removeItemFromInventorySlot(inventory, inventoryItem.slot, amount);
}

export function removeItemFromInventorySlot(
  inventory: Inventory,
  slot: number,
  amount = 0
): Item | null {
  const inventoryItem = getInventoryItemInSlot(inventory, slot);

  if (!inventoryItem) {
    return null;
  }

  const { item } = inventoryItem;

  if (!isStackable(item) || item.amount - amount <= 0 || amount <= 0) {
    inventory.items.splice(
      inventory.items.findIndex((item) => item.slot === slot),
      1
    );
    return item;
  }

  item.amount -= amount;

  return createItem(item.key, { ...item, amount });
}

export function dropItemOnTheGround(item: Item, position: alt.IVector3) {
  //
}

export function addItemToInventory(inventory: Inventory, item: Item, slot?: number) {
  if (isStackable(item)) {
    const existingItem = getInventoryItemByKey(inventory, item.key);

    if (existingItem) {
      if (isStackable(existingItem.item)) {
        existingItem.item.amount += item.amount;
        return true;
      }
      // unreachable
      throw new Error("Existing item is not stackable??");
    }
  }

  const emptySlot = findFreeInventorySlot(inventory, slot);

  if (emptySlot === -1) {
    return false;
  }

  inventory.items.push({
    slot: emptySlot,
    item: toRaw(item),
  });
  return true;
}

export function swapItems(from: InventoryItemSource, to: InventoryItemSource) {
  const fromInventory = findSourceInventory.call(from);
  const toInventory = findSourceInventory.call(to);

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

export function isInventoryFull(inventory: Inventory) {
  return inventory.items.length >= inventory.size;
}

function findFreeInventorySlot(inventory: Inventory, slot?: number) {
  if (slot) {
    if (!inventory.items.some((item) => item.slot === slot)) {
      return slot;
    }
  } else {
    for (let i = 0; i < inventory.size; i++) {
      if (!inventory.items.some((item) => item.slot === i)) {
        return i;
      }
    }
  }
  return -1;
}
