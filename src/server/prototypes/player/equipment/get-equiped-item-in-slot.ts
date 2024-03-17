import alt from "@altv/server";
import { Equipment } from "@shared/modules/items";
import { InGamePlayer } from "@/core/utility/assertions";

declare module "@altv/server" {
  export interface Player {
    getEquipedItemInSlot<T extends keyof Equipment>(
      this: InGamePlayer,
      slot: T,
    ): Equipment[T] | undefined;
  }
}

alt.Player.prototype.getEquipedItemInSlot = function (slot) {
  return this.character.equipment[slot];
};
