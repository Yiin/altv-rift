import alt from "alt-server";
import { InventoryItem } from "@shared/interfaces";
import { getItemEquipmentSlot } from "@shared/modules/items";
import { ServerEvents } from "@shared/events/server";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    equipItem(this: InGamePlayer, item: InventoryItem): void;
  }
}

alt.Player.prototype.equipItem = function (itemToEquip) {
  const equipmentSlot = getItemEquipmentSlot(itemToEquip);

  if (equipmentSlot) {
    // remove item we want to equip from inventory
    this.removeItemFromSlot(itemToEquip.slot);

    // add currently equiped item to inventory
    this.unequipItem(equipmentSlot);

    // add item we want to equip to equipment slot
    // @ts-expect-error
    this.store.character.equipment[equipmentSlot] = itemToEquip.data;
  }

  alt.emit(ServerEvents.FromServer.EQUIP_ITEM, this, itemToEquip.data, itemToEquip.slot);
};
