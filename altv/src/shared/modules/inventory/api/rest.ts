import { EquipmentSlot, Inventory, InventoryItem } from "@shared/interfaces";
import { Item, ItemByKey, ItemKey } from "../../items";

export enum ItemMatchFlags {
  NONE = 0,
  IGNORE_AMOUNT = 1,
}

export function getInventoryItemInSlot(
  inventory: Inventory,
  slot: number,
): InventoryItem<Item> | undefined {
  return inventory.items.find((item) => item.slot === slot);
}

export function getInventoryItem<T extends Item>(
  inventory: Inventory,
  item: Partial<T>,
  flags = ItemMatchFlags.NONE
): InventoryItem<T> | undefined {
  return inventory.items.find((inventoryItem): inventoryItem is InventoryItem<T> =>
    isMatchingItem(item, inventoryItem.item, flags),
  );
}

export function getInventoryItemByKey<K extends ItemKey>(
  inventory: Inventory,
  key: K,
): InventoryItem<ItemByKey<K>> | undefined {
  return inventory.items.find((item): item is InventoryItem<ItemByKey<K>> => item.item.key === key);
}

export function isInventoryFull(inventory: Inventory): boolean {
  return inventory.items.length >= inventory.size;
}

export function isEquipmentSlotQuickSlot(
  slot: EquipmentSlot,
): slot is
  | EquipmentSlot.QuickSlot1
  | EquipmentSlot.QuickSlot2
  | EquipmentSlot.QuickSlot3
  | EquipmentSlot.QuickSlot4
  | EquipmentSlot.QuickSlot5 {
  const isQuickSlot = [
    EquipmentSlot.QuickSlot1,
    EquipmentSlot.QuickSlot2,
    EquipmentSlot.QuickSlot3,
    EquipmentSlot.QuickSlot4,
    EquipmentSlot.QuickSlot5,
  ].includes(slot);

  return isQuickSlot;
}

/**
 * Returns true if part matches itemToMatch properties and it's amount is same or lower than the items.
 * In other words, part is the item we're looking for and itemToMatch is item we're comparing against.
 * If we're looking for grade RARE and amount 100, it itemToMatch has
 * grade COMMON or amount < 100, we return false.
 */
export function isMatchingItem(itemToMatch: Partial<Item>, item: Item, flags = ItemMatchFlags.NONE): boolean {
  if (itemToMatch.key !== item.key) {
    return false;
  }

  if ("grade" in itemToMatch && "grade" in item && itemToMatch.grade !== item.grade) {
    return false;
  }

  if (!(flags & ItemMatchFlags.IGNORE_AMOUNT) && "amount" in itemToMatch && "amount" in item && (!itemToMatch.amount || itemToMatch.amount > item.amount)) {
    return false;
  }

  return true;
}
