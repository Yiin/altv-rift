import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { EquipmentSlot } from "@shared/interfaces";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";
import { emit } from "@/core/events/emit";

declare module "@altv/server" {
  export interface Player {
    applyEquipment(this: InGamePlayer, equipmentSlot?: EquipmentSlot): void;
  }
}

alt.Player.prototype.applyEquipment = function (equipmentSlot) {
  for (const equipmentSlot in this.character.equipment) {
    const slot = equipmentSlot as EquipmentSlot;
    const item = this.getEquipedItemInSlot(slot);

    if (!item) {
      continue;
    }

    if (equipmentSlot && equipmentSlot !== slot) {
      continue;
    }

    emit(ServerEvents.FromServer.ITEM_EQUIP, this, item);
  }
};

alt.Events.onPlayerSpawn(({ player }) => {
  if (!isInGame(player)) {
    return;
  }

  player.applyEquipment();
});
