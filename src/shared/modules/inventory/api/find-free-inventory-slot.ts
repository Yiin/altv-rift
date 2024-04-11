import { Inventory } from "@shared/interfaces";

export function findFreeInventorySlot(inventory: Inventory, slot?: number): number {
  if (typeof slot !== "undefined") {
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
