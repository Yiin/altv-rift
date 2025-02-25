import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { EquipmentSlot } from "@shared/interfaces";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";
import { emit } from "@/core/events/emit";
import { getItemEquipmentSlot } from "@shared/modules/items";

declare module "@altv/server" {
  export interface Player {
    applyEquipment(this: InGamePlayer, equipmentSlot?: EquipmentSlot): void;
  }
}

alt.Player.prototype.applyEquipment = function (specificEquipmentSlot) {
  for (const equipmentSlot in this.character.equipment) {
    const slot = equipmentSlot as EquipmentSlot;
    const item = this.getEquipedItemInSlot(slot);

    if (!item) {
      continue;
    }

    if (getItemEquipmentSlot(item) !== slot) {
      continue;
    }

    if (specificEquipmentSlot && specificEquipmentSlot !== slot) {
      continue;
    }

    const isQuickSlot = [
      EquipmentSlot.QuickSlot1,
      EquipmentSlot.QuickSlot2,
      EquipmentSlot.QuickSlot3,
      EquipmentSlot.QuickSlot4,
      EquipmentSlot.QuickSlot5,
    ].includes(slot);

    if (isQuickSlot) {
      continue;
    }

    emit(ServerEvents.FromServer.ITEM_EQUIP, this, item);
  }
};

alt.Events.onPlayerSpawn(async ({ player }) => {
  if (!isInGame(player)) {
    return;
  }

  player.applyEquipment();
  await alt.Utils.wait(500);
  player.applyEquipment();
});
