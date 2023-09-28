import * as alt from "@altv/server";
import { InventoryItemSource } from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import { getItemEquipmentSlot, getItemInfoByKey, isItemAmmo } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { isItemFishBait } from "@shared/modules/items/registry/fish-bait.items";
import { InGamePlayer } from "@/core/utility/assertions";
import {
  addItemToInventory,
  findItem,
  findSourceInventory,
  loadWeaponWithAmmo,
  removeItem,
} from "@/modules/items-manager";
import { useFishBaitOnFishingRod } from "@/modules/items-manager/items/fishing-rod";
import { emit } from "@/core/events/emit";

declare module "@altv/server" {
  export interface Player {
    equipItem(this: InGamePlayer, source: InventoryItemSource): boolean;
  }
}

/**
 * Tries to equip an item from a source.
 *
 * NOTE:
 *   This method doesn't check if the source is available for the player.
 */
alt.Player.prototype.equipItem = function (source) {
  const item = findItem.call(source, this);

  if (!item) {
    return false;
  }

  const equipmentSlot = isItemFishBait(item) ? "fishbait" : getItemEquipmentSlot(item);

  if (!equipmentSlot) {
    return false;
  }

  const inventory = findSourceInventory.call(source);

  if (!inventory) {
    return false;
  }

  if (equipmentSlot === "ammo") {
    if (
      !loadWeaponWithAmmo(
        {
          type: "equipment",
          equipmentSlot: "weapon",
          source: "character",
          sourceId: this.character.id,
        },
        source
      )
    ) {
      return false;
    }
  } else if (equipmentSlot === "fishbait") {
    if (
      !useFishBaitOnFishingRod(
        {
          type: "equipment",
          equipmentSlot: "tool",
          source: "character",
          sourceId: this.character.id,
        },
        source
      )
    ) {
      return false;
    }
  }
  // Normal flow
  else {
    removeItem(source);

    const unequippedItem = this.character.equipment[equipmentSlot];

    if (unequippedItem && !addItemToInventory(inventory, unequippedItem)) {
      return false;
    }

    // @ts-expect-error item is guaranteed to be of correct type,
    // but TS is complaining that e.g. ClothingItem might be on weapon slot
    this.character.equipment[equipmentSlot] = item;

    if (equipmentSlot === "weapon" && isItemFirearmWeapon(item)) {
      // Quick hack to auto-equip weapon ammo
      if (!item.ammo) {
        const ammo = this.character.inventory.items.find(
          ({ item: ammo }) =>
            isItemAmmo(ammo) &&
            getItemInfoByKey(ammo.key).group === getItemInfoByKey(item.key).ammoGroup
        );

        if (ammo) {
          this.equipItem({
            type: "inventory",
            inventorySlot: ammo.slot,
            source: "character",
            sourceId: this.character.id,
          });
        }
      }
    }
  }

  emit(ServerEvents.FromServer.ITEM_EQUIP, this, item);
  return true;
};
