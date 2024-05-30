import { Player } from "@altv/server";
import { toRaw } from "vue";
import { Item } from "@shared/modules/items";
import { ClientEvents } from "@shared/events/client";
import { addItemToInventory } from "@shared/modules/inventory";
import { InGamePlayer } from "@/core/utility/assertions";

declare module "@altv/server" {
  export interface Player {
    addItem<T extends Item>(this: InGamePlayer, item: T, toSlot?: number): boolean;
  }
}

Player.prototype.addItem = function (itemToAdd, toSlot) {
  const success = addItemToInventory(this.character.inventory, itemToAdd, toSlot);

  if (success) {
    this.emitRaw(ClientEvents.FromServer.INVENTORY_ITEM_ADD, toRaw(itemToAdd));
  }

  return success;
};
