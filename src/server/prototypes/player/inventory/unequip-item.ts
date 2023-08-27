import alt from "alt-server";
import { Equipment, EquipmentSlot } from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import { InGamePlayer } from "@/utility/assertions";
import { unloadAmmoFromWeapon } from "@/modules/items-manager";

declare module "alt-server" {
  export interface Player {
    /**
     * Unequips an item from the player's equipment to the inventory
     */
    unequipItem(this: InGamePlayer, equipmentSlot: EquipmentSlot): boolean;
  }
}

alt.Player.prototype.unequipItem = function (equipmentSlot) {
  if (equipmentSlot === "ammo") {
    if (
      !unloadAmmoFromWeapon({
        type: "equipment",
        equipmentSlot: "weapon",
        source: "character",
        sourceId: this.store.character.id,
      })
    ) {
      return false;
    }
  } else {
    const slot = equipmentSlot as keyof Equipment;
    const item = this.store.character.equipment[slot];

    if (!item) {
      return false;
    }

    if (!this.addItem(item)) {
      return false;
    }

    this.store.character.equipment[slot] = null;
  }

  alt.emit(ServerEvents.FromServer.UNEQUIP_ITEM, this, equipmentSlot);
  return true;
};
