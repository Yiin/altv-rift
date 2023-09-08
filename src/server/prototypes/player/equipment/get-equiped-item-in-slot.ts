import alt from "alt-server";
import { Equipment } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    getEquipedItemInSlot<T extends keyof Equipment>(
      this: InGamePlayer,
      slot: T
    ): Equipment[T] | undefined;
  }
}

alt.Player.prototype.getEquipedItemInSlot = function (slot) {
  return this.character.equipment[slot];
};
