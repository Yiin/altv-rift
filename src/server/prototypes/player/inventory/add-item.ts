import { Player } from "@altv/server";
import { Item } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";
import { addItemToInventory } from "@/modules/items-manager";

declare module "@altv/server" {
  export interface Player {
    addItem<T extends Item>(this: InGamePlayer, item: T, toSlot?: number): boolean;
  }
}

Player.prototype.addItem = function (itemToAdd, toSlot) {
  return addItemToInventory(this.character.inventory, itemToAdd, toSlot);
};
