import alt from "@altv/server";
import { Item } from "@shared/modules/items";
import { getInventoryItem } from "@shared/modules/inventory";
import { InGamePlayer } from "@/core/utility/assertions";

declare module "@altv/server" {
  export interface Player {
    hasItem<T extends Item>(this: InGamePlayer, item: Partial<T>): boolean;
  }
}

alt.Player.prototype.hasItem = function (item) {
  const inventoryItem = getInventoryItem(this.character.inventory, item);

  return !!inventoryItem;
};
