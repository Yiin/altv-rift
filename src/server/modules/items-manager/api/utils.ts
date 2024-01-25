import * as alt from "@altv/server";
import { toRaw } from "vue";
import { GlobalItemSource, Inventory, InventoryItemSource, ItemSourceOrigin, ItemSourceType, PlayerItemSource } from "@shared/interfaces";
import { Item, createItem, isStackable } from "@shared/modules/items";
import { ServerEvents } from "@shared/events/server";
import {
  getInventoryItem,
  getInventoryItemByKey,
  getInventoryItemInSlot,
} from "@shared/modules/inventory";
import { emit } from "@/core/events/emit";
import { InGamePlayer } from "@/core/utility/assertions";
import { findItem, findSourceInventory } from "./hooks";
import { cleanupDroppedItem, dropItemOnTheGround, droppedItems } from "./dropped-items";

export function removeItem(source: InventoryItemSource | GlobalItemSource, amount = 0): Item | null {
  if (source.origin === ItemSourceOrigin.Global) {
    const droppedItemVE = droppedItems.get(source.originId);

    if (!droppedItemVE) {
      return null;
    }

    const item = droppedItemVE.streamSyncedMeta.item;

    if (!item) {
      return null;
    }

    if (isStackable(item) && item.amount - amount < 0) {
      return null;
    }

    if (!isStackable(item) || item.amount - amount === 0 || amount <= 0) {
      cleanupDroppedItem(droppedItemVE.id);
      return item;
    }

    item.amount -= amount;
    droppedItemVE.streamSyncedMeta.item = item;

    return createItem(item.key, { ...item, amount });
  }

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

  if (isStackable(item) && item.amount - amount < 0) {
    return null;
  }

  if (!isStackable(item) || item.amount - amount === 0 || amount <= 0) {
    inventory.items.splice(
      inventory.items.findIndex((item) => item.slot === slot),
      1
    );
    return item;
  }

  item.amount -= amount;

  return createItem(item.key, { ...item, amount });
}

export function dropItem(player: InGamePlayer, source: PlayerItemSource, pos: alt.IVector3) {
  if (source.type === ItemSourceType.PlayerEquipment) {
    const item = findItem.call(source, player);

    if (!item) {
      return false;
    }

    player.removeEquipedItem(source.equipmentSlot);

    dropItemOnTheGround(item, player.pos);
    return true;
  }

  const item = removeItem(source);

  if (!item) {
    return false;
  }

  dropItemOnTheGround(item, player.pos);

  return true;
}

export function addItemToInventory(inventory: Inventory, item: Item, slot?: number) {
  if (isStackable(item)) {
    const existingItem = getInventoryItemByKey(inventory, item.key);

    if (existingItem) {
      if (isStackable(existingItem.item)) {
        existingItem.item.amount += item.amount;

        emit(ServerEvents.FromServer.INVENTORY_ITEM_ADD, {
          inventory,
          item: existingItem.item,
          slot: existingItem.slot,
          amount: item.amount,
        });
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
    price: null,
  });

  const addedItem = getInventoryItemInSlot(inventory, emptySlot);

  emit(ServerEvents.FromServer.INVENTORY_ITEM_ADD, {
    inventory,
    item: addedItem!.item,
    slot: emptySlot,
    amount: "amount" in item ? item.amount : 1,
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

function findFreeInventorySlot(inventory: Inventory, slot?: number) {
  if (slot) {
    if (!inventory.items.some((item) => item.slot === slot)) {
      return slot;
    }
  }
  for (let i = 0; i < inventory.size; i++) {
    if (!inventory.items.some((item) => item.slot === i)) {
      return i;
    }
  }
  return -1;
}
