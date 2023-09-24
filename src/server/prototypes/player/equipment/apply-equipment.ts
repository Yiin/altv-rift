import * as alt from "@altv/server";
import { isReactive } from "vue";
import { ServerEvents } from "@shared/events/server";
import { Equipment } from "@shared/modules/items";
import { InGamePlayer, isInGame } from "@/utility/assertions";

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

    try {
      alt.Events.emit("test", item);
    } catch (err) {
      alt.logError(`Failed to emit event: ${err}`);
      alt.log(item);
      // @ts-expect-error
      alt.log(item["__v_isReactive"]);
      alt.log(Object.getOwnPropertyDescriptor(item, "__v_isReactive"));
      alt.log(isReactive(item) ? "reactive" : "raw");
    }
    // alt.Events.emit(ServerEvents.FromServer.EQUIP_ITEM, this, item);
  }
};

alt.Events.onPlayerSpawn(({ player }) => {
  if (!isInGame(player)) {
    return;
  }

  player.applyEquipment();
});
