import { Player } from "@altv/server";
import { toRaw } from "@yiin/reactive-proxy-state";
import { Item } from "@shared/modules/items";
import { ClientEvents } from "@shared/events/client";
import { addItemToInventory } from "@shared/modules/inventory";
import { InGamePlayer } from "@/core/utility/assertions";
import { dropItemOnTheGround } from "@/modules/items-manager";

type AddItemOptions = {
  toSlot?: number;
  dropOnFail?: boolean; // If true, the item will be dropped on the ground if the inventory is full and function will return true
};

declare module "@altv/server" {
  export interface Player {
    addItem<T extends Item>(this: InGamePlayer, item: T, options?: AddItemOptions): boolean;
  }
}

Player.prototype.addItem = function (itemToAdd, options) {
  const success = addItemToInventory(this.character.inventory, itemToAdd, options?.toSlot);

  if (success) {
    this.emitRaw(ClientEvents.FromServer.INVENTORY_ITEM_ADD, toRaw(itemToAdd));
  }

  if (options?.dropOnFail && !success) {
    dropItemOnTheGround(itemToAdd, this.pos);
    return true;
  }

  return success;
};
