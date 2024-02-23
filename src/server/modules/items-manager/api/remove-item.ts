import alt from "@altv/server";
import { ItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { Item, isStackable, createItem } from "@shared/modules/items";
import { isInGame } from "@/core/utility/assertions";
import { cleanupDroppedItem } from "../dropped-items";
import { removeItemFromInventorySlot } from "./remove-item-from-inventory-slot";
import { findInventoryByItemSource } from "./find-inventory-by-item-source";

/**
 * Removes item from given source and returns it
 */
export function removeItem(source: ItemSource, amount = 0): Item | null {
  /**
   * Items on the ground
   */
  if (source.origin === ItemSourceOrigin.Ground) {
    const droppedItemVE = alt.VirtualEntity.getByID(source.originId);

    if (!droppedItemVE) {
      return null;
    }

    const item = droppedItemVE.streamSyncedMeta.item;

    if (!item) {
      return null;
    }

    if (isStackable(item) && item.amount - amount < 0) {
      return null;
    }

    if (!isStackable(item) || item.amount - amount === 0 || amount <= 0) {
      cleanupDroppedItem(droppedItemVE.id);
      return item;
    }

    item.amount -= amount;
    droppedItemVE.streamSyncedMeta.item = item;

    return createItem(item.key, { ...item, amount });
  }

  /**
   * Equiped player items
   */
  if (source.origin === ItemSourceOrigin.PlayerEquipment) {
    const player = alt.Player.all.find((p) => p.character?.id === source.originId);

    if (!player || !isInGame(player)) {
      return null;
    }

    return player.removeEquipedItem(source.equipmentSlot);
  }

  /**
   * Items in some inventory
   */
  const inventory = findInventoryByItemSource(source);

  if (!inventory) {
    return null;
  }

  return removeItemFromInventorySlot(inventory, source.inventorySlot, amount);
}