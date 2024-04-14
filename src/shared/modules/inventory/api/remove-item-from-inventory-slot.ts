import { Inventory } from "@shared/interfaces";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { Item, isStackable, createItem } from "@shared/modules/items";

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
    console.log(`Removing item from slot ${slot}`);
    inventory.items.splice(
      inventory.items.findIndex((item) => item.slot === slot),
      1,
    );
    return item;
  }

  item.amount -= amount;

  return createItem(item.key, { ...item, amount });
}
