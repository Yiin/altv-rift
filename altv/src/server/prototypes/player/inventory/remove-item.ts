import alt from "@altv/server";
import { Item, ItemKey } from "@shared/modules/items";
import { getInventoryItem, getInventoryItemByKey, ItemMatchFlags, removeItemFromInventorySlot } from "@shared/modules/inventory";
import { InGamePlayer } from "@/core/utility/assertions";

declare module "@altv/server" {
  export interface Player {
    removeInventoryItemByKey<T extends ItemKey>(
      this: InGamePlayer,
      key: T,
      amount?: number,
    ): boolean;
    removeInventoryItem<T extends Item>(this: InGamePlayer, item: Partial<T>, amount?: number): boolean;
  }
}

alt.Player.prototype.removeInventoryItemByKey = function (key, amount = 0) {
  const item = getInventoryItemByKey(this.character.inventory, key);

  if (!item) {
    return false;
  }

  return removeItemFromInventorySlot(this.character.inventory, item.slot, amount) !== null;
};

alt.Player.prototype.removeInventoryItem = function (itemToRemove, amount = 0) {
  const inventoryItem = getInventoryItem(this.character.inventory, itemToRemove, ItemMatchFlags.IGNORE_AMOUNT);

  if (!inventoryItem) {
    return false;
  }

  return removeItemFromInventorySlot(this.character.inventory, inventoryItem.slot, amount) !== null;
};
