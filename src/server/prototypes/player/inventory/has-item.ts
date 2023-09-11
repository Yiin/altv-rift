import alt from "@altv/server";
import { ItemKey, isStackable } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";
import { getInventoryItemByKey } from "@/modules/items-manager";

declare module "@altv/server" {
  export interface Player {
    hasItem<T extends ItemKey>(this: InGamePlayer, key: T, amount?: number): boolean;
  }
}

alt.Player.prototype.hasItem = function (key, amount = 0) {
  const inventoryItem = getInventoryItemByKey(this.character.inventory, key);

  if (!inventoryItem) {
    return false;
  }

  return isStackable(inventoryItem.item) ? inventoryItem.item.amount >= amount : true;
};
