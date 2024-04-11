import { toRaw } from "vue";
import { getInventoryItemByKey } from "@shared/modules/inventory";
import { Item, isStackable } from "@shared/modules/items";
import { Inventory } from "@shared/interfaces";
import { findFreeInventorySlot } from "./find-free-inventory-slot";

export function addItemToInventory(inventory: Inventory, item: Item, slot?: number): boolean {
  if (isStackable(item)) {
    const existingItem = getInventoryItemByKey(inventory, item.key);

    if (existingItem) {
      if (isStackable(existingItem.item)) {
        existingItem.item.amount += item.amount;

        return true;
      }
      // unreachable
      return false;
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
