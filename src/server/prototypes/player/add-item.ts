import { Player } from "alt-server";
import {
  Inventory,
  InventoryItem,
  ItemData,
  ItemTypeByKey,
  ItemTypeData,
} from "@shared/interfaces";
import { ItemKey, getItemType, getItemData } from "@shared/modules/items";

declare module "alt-server" {
  export interface Player {
    addItem<T extends ItemKey>(
      key: T,
      data: ItemTypeData[ItemTypeByKey<typeof key>]
    ): InventoryItem | undefined;
  }
}

Player.prototype.addItem = function (key, data) {
  if (!this.store.isLoggedIn) return;

  const type = getItemType(key);

  const item = this.store.character?.inventory.items.find((item) => {
    return item.data.key === key;
  });

  if (item) {
    const itemData = getItemData(item.data);

    if (itemData && "amount" in itemData && "amount" in data) {
      itemData.amount += data.amount;
      return;
    }
  }

  const freeSlot = findFreeSlot(this.store.character.inventory);

  if (freeSlot === -1) return;

  const inventoryItem = {
    slot: freeSlot,
    data: {
      key,
      type,
      [type]: data,
    } as any as ItemData,
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
