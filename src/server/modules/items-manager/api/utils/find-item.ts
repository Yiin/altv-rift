import * as alt from "@altv/server";
import { createItem } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { ItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";
import { droppedItems } from "../dropped-items";
import { getInteractionInventory } from "../../interaction-inventory.registry";

/**
 * Find an item by its source.
 * If player is provided, it will only search items accessible by the player.
 * Accessible to the player doesn't mean the player can interact with it.
 */
export function findItem(itemSource: ItemSource, player?: InGamePlayer) {
  /**
   * Player source
   */
  if (itemSource.origin === ItemSourceOrigin.PlayerEquipment || itemSource.origin === ItemSourceOrigin.PlayerInventory) {
    const sourcePlayer = alt.Player.all.find(
      (p): p is InGamePlayer => p.character?.id === itemSource.originId
    );

    if (!sourcePlayer) {
      return null;
    }

    if (player && sourcePlayer.id !== player.id) {
      return null;
    }

    if (itemSource.origin === ItemSourceOrigin.PlayerEquipment) {
      if (itemSource.equipmentSlot === "ammo") {
        const weapon = sourcePlayer.character.equipment.weapon;

        if (!weapon || !isItemFirearmWeapon(weapon)) {
          return null;
        }

        const ammo = weapon.ammo;

        if (!ammo) {
          return null;
        }

        return createItem(ammo.key, {
          amount: ammo.clip + ammo.rest,
        });
      }
      return sourcePlayer.character.equipment[itemSource.equipmentSlot] ?? null;
    }

    return (
      getInventoryItemInSlot(sourcePlayer.character.inventory, itemSource.inventorySlot)?.item ?? null
    );
  }

  /**
   * Ground source
   */
  if (itemSource.origin === ItemSourceOrigin.Ground) {
    const droppedItemVE = droppedItems.get(itemSource.originId);

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
        droppedItemVE.streamSyncedMeta.item = target;
        return ret;
      },
    });
  }

  /**
   * Interaction inventory
   */
  if (itemSource.origin === ItemSourceOrigin.InteractionInventory) {
    const inventory = getInteractionInventory(itemSource.originId);

    if (!inventory) {
      return null;
    }

    // return getInventoryItemInSlot(inventory, itemSource.inventorySlot)?.item ?? null;
  }

  return null;
}
