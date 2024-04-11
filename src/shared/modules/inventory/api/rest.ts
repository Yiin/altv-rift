import { isEqual } from "lodash-es";
import { EquipmentSlot, Inventory, InventoryItem } from "@shared/interfaces";
import { Item, ItemByKey, ItemKey } from "../../items";

export function getInventoryItemInSlot(
  inventory: Inventory,
  slot: number,
): InventoryItem<Item> | undefined {
  return inventory.items.find((item) => item.slot === slot);
}

export function getInventoryItem<T extends Item>(
  inventory: Inventory,
  item: T,
): InventoryItem<T> | undefined {
  return inventory.items.find((inventoryItem): inventoryItem is InventoryItem<T> =>
    isEqual(inventoryItem.item, item),
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
  | EquipmentSlot.QuickSlot4 {
  const isQuickSlot = [
    EquipmentSlot.QuickSlot1,
    EquipmentSlot.QuickSlot2,
    EquipmentSlot.QuickSlot3,
    EquipmentSlot.QuickSlot4,
  ].includes(slot);

  return isQuickSlot;
}
