import { Player } from "alt-server";
import { Item } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";
import { addItemToInventory } from "@/modules/items-manager";

declare module "alt-server" {
  export interface Player {
    addItem<T extends Item>(this: InGamePlayer, item: T): boolean;
  }
}

Player.prototype.addItem = function (itemToAdd) {
  return addItemToInventory(this.character.inventory, itemToAdd);
};
