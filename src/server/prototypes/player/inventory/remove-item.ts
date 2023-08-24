import alt from "alt-server";
import { InventoryItem } from "@shared/interfaces";
import { ItemKey, getItemData, isStackable } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    removeItem<T extends InventoryItem>(this: InGamePlayer, item?: T, amount?: number): boolean;
    removeItemByKey<T extends ItemKey>(this: InGamePlayer, key: T, amount?: number): boolean;
    removeItemFromSlot(this: InGamePlayer, slot: number): boolean;
  }
}

alt.Player.prototype.removeItem = function (item, amount = 0) {
  if (!item) {
    return false;
  }

  const itemData = getItemData(item.data);

  if (!itemData) {
    return false;
  }

  if (!isStackable(itemData) || itemData.amount <= 0 || amount <= 0) {
    this.store.character.inventory.items.splice(
      this.store.character.inventory.items.indexOf(item),
      1
    );
  } else if (isStackable(itemData)) {
    itemData.amount -= amount;

    if (itemData.amount <= 0) {
      this.store.character.inventory.items.splice(
        this.store.character.inventory.items.indexOf(item),
        1
      );
    }
  }

  return true;
};

alt.Player.prototype.removeItemByKey = function (key, amount = 0) {
  const item = this.store.character?.inventory.items.find((item) => {
    return item.data.key === key;
  });

  return this.removeItem(item, amount);
};

alt.Player.prototype.removeItemFromSlot = function (slot, amount = 0) {
  if (!this.store.isLoggedIn) {
    return false;
  }

  const item = this.store.character?.inventory.items.find((item) => {
    return item.slot === slot;
  });

  return this.removeItem(item, amount);
};
