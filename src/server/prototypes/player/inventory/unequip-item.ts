import alt from "alt-server";
import { Equipment, EquipmentSlot } from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    unequipItem(this: InGamePlayer, equipmentSlot: EquipmentSlot): void;
  }
}

alt.Player.prototype.unequipItem = function (equipmentSlot) {
  if (equipmentSlot in this.store.character.equipment) {
    const slot = equipmentSlot as keyof Equipment;
    const item = this.store.character.equipment[slot];

    if (!item) {
      return;
    }

    this.store.character.equipment[slot] = null;
    this.addItem(item);
  }

  alt.emit(ServerEvents.FromServer.UNEQUIP_ITEM, this, equipmentSlot);
};
