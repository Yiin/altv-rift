import { isEqual } from "lodash-es";
import { Inventory, InventoryItem } from "@shared/interfaces";
import { Item, ItemByKey, ItemKey } from "../items";

export function getInventoryItemInSlot(inventory: Inventory, slot: number) {
  return inventory.items.find((item) => item.slot === slot);
}

export function getInventoryItem(inventory: Inventory, item: Item) {
  return inventory.items.find((inventoryItem) => isEqual(inventoryItem.item, item));
}

export function getInventoryItemByKey<K extends ItemKey>(
  inventory: Inventory,
  key: K
): InventoryItem<ItemByKey<K>> | undefined {
  return inventory.items.find((item) => item.item.key === key);
}

export function isInventoryFull(inventory: Inventory) {
  return inventory.items.length >= inventory.size;
}
