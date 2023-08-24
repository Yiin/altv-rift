import { Player } from "alt-server";
import { toRaw } from "vue";
import { Inventory, InventoryItem, Item } from "@shared/interfaces";
import { getItemData, isStackable } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    addItem<T extends Item>(this: InGamePlayer, item: T): InventoryItem<T> | undefined;
  }
}

Player.prototype.addItem = function (itemToAdd) {
  const existingInventoryItem = this.store.character?.inventory.items.find((item) => {
    return item.data.key === itemToAdd.key;
  });

  if (existingInventoryItem) {
    const existingInventoryItemData = getItemData(existingInventoryItem.data);
    const itemToAddData = getItemData(itemToAdd);

    if (isStackable(existingInventoryItemData) && isStackable(itemToAddData)) {
      existingInventoryItemData.amount += itemToAddData.amount;
      return existingInventoryItem as InventoryItem<typeof itemToAdd>;
    }
  }

  const freeSlot = findFreeSlot(this.store.character.inventory);

  if (freeSlot === -1) {
    return;
  }

  const inventoryItem = {
    slot: freeSlot,
    // toRaw because otherwise it might not serialize in case we pass reactive data,
    // e.g. when unequiping an item
    data: toRaw(itemToAdd),
  };

  this.store.character.inventory.items.push(inventoryItem);

  return inventoryItem;
};

function findFreeSlot(inventory: Inventory) {
  for (let i = 0; i < inventory.size; i++) {
    if (!inventory.items.some((item) => item.slot === i)) {
      return i;
    }
  }
  return -1;
}
