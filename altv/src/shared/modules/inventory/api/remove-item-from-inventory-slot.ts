import { Inventory } from "@shared/interfaces";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { Item, isStackable, createItem } from "@shared/modules/items";
import { emitInventoryEvent, InventoryEvents } from "../inventory.context";

export function removeItemFromInventorySlot(
  inventory: Inventory,
  slot: number,
  amount = 0,
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
      1,
    );

    emitInventoryEvent(InventoryEvents.INVENTORY_ITEM_REMOVE, inventory, item);
    return item;
  }

  item.amount -= amount;

  emitInventoryEvent(
    InventoryEvents.INVENTORY_ITEM_REMOVE,
    inventory,
    createItem(item.key, { ...item, amount }),
  );
  return createItem(item.key, { ...item, amount });
}
