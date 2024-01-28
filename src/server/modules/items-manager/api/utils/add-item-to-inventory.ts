import { toRaw } from "vue";
import { ServerEvents } from "@shared/events/server";
import { getInventoryItemByKey, getInventoryItemInSlot } from "@shared/modules/inventory";
import { Item, isStackable } from "@shared/modules/items";
import { Inventory } from "@shared/interfaces";
import { emit } from "@/core/events/emit";
import { findFreeInventorySlot } from "./find-free-inventory-slot";

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