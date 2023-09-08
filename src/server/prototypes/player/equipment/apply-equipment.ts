import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { Equipment } from "@shared/modules/items";
import { InGamePlayer, isInGame } from "@/utility/assertions";

declare module "alt-server" {
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

    alt.emit(ServerEvents.FromServer.EQUIP_ITEM, this, item);
  }
};

alt.on("playerSpawn", (player) => {
  if (!isInGame(player)) {
    return;
  }

  player.applyEquipment();
});
