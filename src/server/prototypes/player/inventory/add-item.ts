import { Player } from "@altv/server";
import { Item } from "@shared/modules/items";
import { ClientEvents } from "@shared/events/client";
import { InGamePlayer } from "@/core/utility/assertions";
import { addItemToInventory } from "@/modules/items-manager";

declare module "@altv/server" {
  export interface Player {
    addItem<T extends Item>(this: InGamePlayer, item: T, toSlot?: number): boolean;
  }
}

Player.prototype.addItem = function (itemToAdd, toSlot) {
  const success = addItemToInventory(this.character.inventory, itemToAdd, toSlot);

  if (success) {
    this.emitRaw(ClientEvents.FromServer.INVENTORY_ITEM_ADD, itemToAdd);
  }

  return success;
};
