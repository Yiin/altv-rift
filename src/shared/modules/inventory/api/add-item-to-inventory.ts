import { toRaw } from "vue";
import { getInventoryItem } from "@shared/modules/inventory";
import { Item, isStackable } from "@shared/modules/items";
import { Inventory } from "@shared/interfaces";
import { findFreeInventorySlot } from "./find-free-inventory-slot";

export function addItemToInventory(inventory: Inventory, item: Item, slot?: number): boolean {
  if (isStackable(item)) {
    const existingItem = getInventoryItem(inventory, item);

    if (existingItem) {
      existingItem.item.amount += item.amount;

      return true;
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

  return true;
}
