import { Player } from "alt-server";
import { Inventory } from "@shared/interfaces";
import { ItemKey, getItemType, getItemData } from "@shared/modules/items";

declare module "alt-server" {
  export interface Player {
    removeItem<T extends ItemKey>(key: T, amount?: number): boolean;
  }
}

Player.prototype.removeItem = function (key, amount = 1) {
  if (!this.store.isLoggedIn) {
    return false;
  }

  const item = this.store.character?.inventory.items.find((item) => {
    return item.data.key === key;
  });

  if (item) {
    const itemData = getItemData(item.data);

    if (!itemData) {
      return false;
    }

    if ("amount" in itemData && amount > 0) {
      itemData.amount -= amount;
    }

    if (!("amount" in itemData) || itemData.amount <= 0) {
      this.store.character.inventory.items.splice(
        this.store.character.inventory.items.indexOf(item),
        1
      );
    }

    return true;
  }

  return false;
};
