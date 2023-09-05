import alt from "alt-server";
import { ItemKey, getItemData, isStackable } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";
import { getInventoryItemByKey } from "@/modules/items-manager";

declare module "alt-server" {
  export interface Player {
    hasItem<T extends ItemKey>(this: InGamePlayer, key: T, amount?: number): boolean;
  }
}

alt.Player.prototype.hasItem = function (key, amount = 0) {
  const inventoryItem = getInventoryItemByKey(this.character.inventory, key);

  if (!inventoryItem) {
    return false;
  }

  const item = getItemData(inventoryItem.item);

  return isStackable(item) ? item.amount >= amount : true;
};
