import { Inventory } from "@shared/interfaces";
import { ItemMatchFlags, getInventoryItem } from "@shared/modules/inventory";
import { Item } from "@shared/modules/items";
import { removeItemFromInventorySlot } from "./remove-item-from-inventory-slot";

export function removeItemFromInventory<T extends Item>(
  inventory: Inventory,
  item: Partial<T>,
  amount = 0,
): Item | null {
  const inventoryItem = getInventoryItem(inventory, item, ItemMatchFlags.IGNORE_AMOUNT);

  if (!inventoryItem) {
    return null;
  }

  return removeItemFromInventorySlot(inventory, inventoryItem.slot, amount);
}
