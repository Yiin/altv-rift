import alt from "@altv/server";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { ItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { Item } from "@shared/modules/items";
import { InGamePlayer } from "@/core/utility/assertions";
import { getStorageInventory } from "../storage";

/**
 * Find an item by its source.
 * If player is provided, it will only search items accessible by the player.
 * Accessible to the player doesn't mean the player can interact with it.
 */
export function findItem(itemSource: ItemSource, player?: InGamePlayer): Item | null {
  /**
   * Player source
   */
  if (
    itemSource.origin === ItemSourceOrigin.PlayerEquipment ||
    itemSource.origin === ItemSourceOrigin.PlayerInventory
  ) {
    const sourcePlayer = alt.Player.all.find(
      (p): p is InGamePlayer => p.character?.id === itemSource.originId,
    );

    if (!sourcePlayer) {
      return null;
    }

    if (player && sourcePlayer.id !== player.id) {
      return null;
    }

    if (itemSource.origin === ItemSourceOrigin.PlayerEquipment) {
      return sourcePlayer.character.equipment[itemSource.equipmentSlot] ?? null;
    }

    return (
      getInventoryItemInSlot(sourcePlayer.character.inventory, itemSource.inventorySlot)?.item ??
      null
    );
  }

  /**
   * Ground source
   */
  if (itemSource.origin === ItemSourceOrigin.Ground) {
    const droppedItemVE = alt.VirtualEntity.getByID(itemSource.originId);

    if (!droppedItemVE) {
      return null;
    }

    if (!droppedItemVE.streamSyncedMeta.item) {
      return null;
    }

    if (player && player.pos.distanceTo(droppedItemVE.pos) > 8) {
      return null;
    }

    return new Proxy(droppedItemVE.streamSyncedMeta.item, {
      set(target, prop, value, receiver) {
        const ret = Reflect.set(target, prop, value, receiver);
        if (droppedItemVE.valid) {
          droppedItemVE.streamSyncedMeta.item = target;
        }
        return ret;
      },
    });
  }

  /**
   * Interaction inventory
   */
  if (itemSource.origin === ItemSourceOrigin.Storage) {
    const inventory = getStorageInventory(itemSource.originId);

    if (!inventory) {
      return null;
    }

    // return getInventoryItemInSlot(inventory, itemSource.inventorySlot)?.item ?? null;
  }

  return null;
}
