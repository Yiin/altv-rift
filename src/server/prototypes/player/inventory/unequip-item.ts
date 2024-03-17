import alt from "@altv/server";
import { EquipmentSlot, InventoryItemSource } from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import { Equipment, Item } from "@shared/modules/items";
import { InGamePlayer } from "@/core/utility/assertions";
import { addItemToInventory, findInventoryByItemSource } from "@/modules/items-manager";
import { emit } from "@/core/events/emit";

declare module "@altv/server" {
  export interface Player {
    /**
     * Unequips an item from the player's equipment to the inventory
     */
    unequipItem(
      this: InGamePlayer,
      equipmentSlot: EquipmentSlot,
      to?: InventoryItemSource,
    ): boolean;

    /**
     * Removes an item from the player's equipment
     */
    removeEquipedItem(this: InGamePlayer, equipmentSlot: EquipmentSlot): Item | null;
  }
}

alt.Player.prototype.unequipItem = function (equipmentSlot, to) {
  const slot = equipmentSlot as keyof Equipment;
  const item = this.character.equipment[slot];

  if (!item) {
    return false;
  }

  if (to) {
    const inventory = findInventoryByItemSource(to);
    if (!inventory) {
      return false;
    }
    if (!addItemToInventory(inventory, item, to.inventorySlot)) {
      return false;
    }
  } else if (!addItemToInventory(this.character.inventory, item)) {
    return false;
  }

  this.character.equipment[slot] = null;

  emit(ServerEvents.FromServer.ITEM_UNEQUIP, this, equipmentSlot);
  return true;
};

alt.Player.prototype.removeEquipedItem = function (equipmentSlot) {
  const slot = equipmentSlot as keyof Equipment;
  const item = this.character.equipment[slot];

  if (!item) {
    return null;
  }

  this.character.equipment[slot] = null;

  emit(ServerEvents.FromServer.ITEM_UNEQUIP, this, equipmentSlot);
  return item;
};
