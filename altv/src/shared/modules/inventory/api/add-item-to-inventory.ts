import { toRaw } from "@yiin/reactive-proxy-state";
import { ItemMatchFlags, getInventoryItem } from "@shared/modules/inventory";
import { Item, StackableItem, isStackable } from "@shared/modules/items";
import { Inventory } from "@shared/interfaces";
import { findFreeInventorySlot } from "./find-free-inventory-slot";
import { emitInventoryEvent, InventoryEvents } from "../inventory.context";

export function addItemToInventory(inventory: Inventory, item: Item, slot?: number): boolean {
  if (isStackable(item)) {
    const existingItem = getInventoryItem(
      inventory,
      item as Partial<StackableItem>,
      ItemMatchFlags.IGNORE_AMOUNT,
    );

    if (existingItem) {
      existingItem.item.amount += item.amount;

      emitInventoryEvent(InventoryEvents.INVENTORY_ITEM_ADD, inventory, item);
      return true;
    }
  }

  const emptySlot = findFreeInventorySlot(inventory, slot);

  if (emptySlot === -1) {
    emitInventoryEvent(InventoryEvents.INVENTORY_FULL, inventory);
    return false;
  }

  inventory.items.push({
    slot: emptySlot,
    item: toRaw(item),
    price: null,
  });

  emitInventoryEvent(InventoryEvents.INVENTORY_ITEM_ADD, inventory, item);
  return true;
}
