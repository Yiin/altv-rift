import { Inventory } from "@shared/interfaces";
import { getInventoryItem } from "@shared/modules/inventory";
import { Item } from "@shared/modules/items";
import { removeItemFromInventorySlot } from "./remove-item-from-inventory-slot";

export function removeItemFromInventory(inventory: Inventory, item: Item, amount = 0): Item | null {
  const inventoryItem = getInventoryItem(inventory, item);

  if (!inventoryItem) {
    return null;
  }

  return removeItemFromInventorySlot(inventory, inventoryItem.slot, amount);
}
