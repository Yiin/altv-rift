import * as alt from "@altv/server";
import { InventoryItem } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";

declare module "@altv/server" {
  export interface Player {
    getInventoryItemInSlot(this: InGamePlayer, slot: number): InventoryItem | undefined;
  }
}

alt.Player.prototype.getInventoryItemInSlot = function (slot) {
  return this.character.inventory.items.find((item) => item.slot === slot);
};
