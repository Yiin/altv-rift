import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { Equipment } from "@shared/modules/items";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";
import { emit } from "@/core/events/emit";

declare module "@altv/server" {
  export interface Player {
    applyEquipment(this: InGamePlayer): void;
  }
}

alt.Player.prototype.applyEquipment = function () {
  for (const equipmentSlot in this.character.equipment) {
    const slot = equipmentSlot as keyof Equipment;
    const item = this.getEquipedItemInSlot(slot);

    if (!item) {
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
