import alt from "@altv/server";
import { EquipmentSlot, GroundItemSource, InventoryItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import { getItemEquipmentSlot, isItemKeyClothing, isMaleClothing, isUnisexClothing } from "@shared/modules/items";
import { isItemFishBait } from "@shared/modules/items/registry/fish-bait.items";
import { InGamePlayer } from "@/core/utility/assertions";
import {
  addItemToInventory,
  findItem,
  findInventoryByItemSource,
  removeItem,
} from "@/modules/items-manager";
import { useFishBaitOnFishingRod } from "@/modules/items-manager/items/fishing-rod";
import { emit } from "@/core/events/emit";
import { dropItemOnTheGround } from "@/modules/items-manager/dropped-items";

declare module "@altv/server" {
  export interface Player {
    equipItem(this: InGamePlayer, source: InventoryItemSource | GroundItemSource): boolean;
  }
}

/**
 * Tries to equip an item from a source.
 *
 * NOTE:
 *   This method doesn't check if the source is available for the player.
 */
alt.Player.prototype.equipItem = function (source) {
  const item = findItem(source, this);

  if (!item) {
    return false;
  }

  const equipmentSlotOrFishbait = isItemFishBait(item) ? "fishbait" : getItemEquipmentSlot(item);

  if (!equipmentSlotOrFishbait) {
    return false;
  }

  const inventory = source.origin === ItemSourceOrigin.Ground ? null : findInventoryByItemSource(source);

  if (source.origin !== ItemSourceOrigin.Ground && !inventory) {
    return false;
  }

  if (equipmentSlotOrFishbait === "fishbait") {
    if (
      !useFishBaitOnFishingRod(
        {
          equipmentSlot: EquipmentSlot.Tool,
          origin: ItemSourceOrigin.PlayerEquipment,
          originId: this.character.id,
        },
        source
      )
    ) {
      return false;
    }
  }
  // Normal flow
  else {
    const equipmentSlot = equipmentSlotOrFishbait;

    if (
      isItemKeyClothing(item.key)
      // If player gender doesn't match with clothing gender, don't equip
      && (
        (this.model === alt.hash("mp_f_freemode_01") && isMaleClothing(item.key) && !isUnisexClothing(item.key))
        ||
        (this.model === alt.hash("mp_m_freemode_01") && !isMaleClothing(item.key) && !isUnisexClothing(item.key))
      )
    ) {
      return false;
    }

    removeItem(source);

    const unequippedItem = this.character.equipment[equipmentSlot];

    if (unequippedItem) {
      if (inventory) {
        if (!addItemToInventory(inventory, unequippedItem)) {
          return false;
        }
      } else {
        dropItemOnTheGround(unequippedItem, this.pos);
      }
    }

    // @ts-expect-error item is guaranteed to be of correct type,
    // but TS is complaining that e.g. ClothingItem might be on weapon slot
    this.character.equipment[equipmentSlot] = item;
  }

  emit(ServerEvents.FromServer.ITEM_EQUIP, this, item);
  return true;
};
