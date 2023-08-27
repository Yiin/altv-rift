import alt from "alt-server";
import {
  AmmoItem,
  FirearmWeaponItem,
  Inventory,
  InventoryItemSource,
  Item,
  ItemSource,
} from "@shared/interfaces";
import {
  createItem,
  getItemData,
  getItemInfoByKey,
  isItemAmmo,
  isStackable,
  toEquipedAmmo,
} from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/weapons/firearms";
import { InGamePlayer } from "@/utility/assertions";
import { findItem, findSourceInventory } from "./hooks";

export function getInventoryItemInSlot(inventory: Inventory, slot: number) {
  return inventory.items.find((item) => item.slot === slot);
}

export function getInventoryItemByKey(inventory: Inventory, key: string) {
  return inventory.items.find((item) => item.item.key === key);
}

export function removeItem(source: InventoryItemSource, amount = 0): Item | null {
  const inventory = findSourceInventory.call(source);

  if (!inventory) {
    return null;
  }

  return removeItemFromInventory(inventory, source.inventorySlot, amount);
}

export function removeItemFromInventory(
  inventory: Inventory,
  slot: number,
  amount = 0
): Item | null {
  const inventoryItem = getInventoryItemInSlot(inventory, slot);

  if (!inventoryItem) {
    return null;
  }

  const { item } = inventoryItem;

  const itemData = getItemData(item);

  if (!itemData) {
    return null;
  }

  if (!isStackable(itemData) || itemData.amount - amount <= 0 || amount <= 0) {
    inventory.items.splice(
      inventory.items.findIndex((item) => item.slot === slot),
      1
    );
    return item;
  }

  itemData.amount -= amount;

  return createItem(item.key, { ...itemData, amount });
}

export function dropItemOnTheGround(item: Item, position: alt.IVector3) {
  //
}

export function addItemToInventory(inventory: Inventory, item: Item) {
  const itemData = getItemData(item);

  if (isStackable(itemData)) {
    const existingItem = getInventoryItemByKey(inventory, item.key);

    if (existingItem) {
      const existingItemData = getItemData(existingItem.item);

      if (isStackable(existingItemData)) {
        existingItemData.amount += itemData.amount;
        return true;
      }
    }
  } else {
    const emptySlot = findFreeInventorySlot(inventory);

    if (emptySlot === -1) {
      return false;
    }

    inventory.items.push({
      slot: emptySlot,
      item,
    });
    return true;
  }

  return false;
}

export function swapItems(from: InventoryItemSource, to: InventoryItemSource) {
  const fromInventory = findSourceInventory.call(from);
  const toInventory = findSourceInventory.call(to);

  if (!fromInventory || !toInventory) {
    return false;
  }

  const fromItem = getInventoryItemInSlot(fromInventory, from.inventorySlot);
  const toItem = getInventoryItemInSlot(toInventory, to.inventorySlot);

  if (!fromItem || !toItem) {
    return false;
  }

  if (fromInventory === toInventory) {
    [fromItem.slot, toItem.slot] = [toItem.slot, fromItem.slot];
  } else {
    [fromItem.item, toItem.item] = [toItem.item, fromItem.item];
  }

  return true;
}

export function isInventoryFull(inventory: Inventory) {
  return inventory.items.length >= inventory.size;
}

function findFreeInventorySlot(inventory: Inventory) {
  for (let i = 0; i < inventory.size; i++) {
    if (!inventory.items.some((item) => item.slot === i)) {
      return i;
    }
  }
  return -1;
}
