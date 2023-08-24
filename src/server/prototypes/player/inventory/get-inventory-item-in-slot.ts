import alt from "alt-server";
import { InventoryItem } from "@shared/interfaces";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    getInventoryItemInSlot(this: InGamePlayer, slot: number): InventoryItem | undefined;
  }
}

alt.Player.prototype.getInventoryItemInSlot = function (slot) {
  return this.store.character.inventory.items.find((item) => item.slot === slot);
};
