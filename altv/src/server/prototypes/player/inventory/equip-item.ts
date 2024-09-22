import alt from "@altv/server";
import {
  EquipmentSlot,
  GroundItemSource,
  InventoryItemSource,
  ItemSourceOrigin,
  PlayerEquipmentItemSource,
} from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import {
  getItemEquipmentSlot,
  isItemAmmo,
  isItemKeyClothing,
  isMaleClothing,
  isUnisexClothing,
} from "@shared/modules/items";
import { addItemToInventory, isMatchingItem, ItemMatchFlags } from "@shared/modules/inventory";
import { isItemFishingBait } from "@shared/modules/items/registry/fish-bait.items";
import { InGamePlayer } from "@/core/utility/assertions";
import { findItem, findInventoryByItemSource, removeItem } from "@/modules/items-manager";
import { useFishingBaitOnFishingRod } from "@/modules/items-manager/items/fishing-rod.manager";
import { emit } from "@/core/events/emit";
import { dropItemOnTheGround } from "@/modules/items-manager/dropped-items";

declare module "@altv/server" {
  export interface Player {
    equipItem(
      this: InGamePlayer,
      source: PlayerEquipmentItemSource | InventoryItemSource | GroundItemSource,
      equipmentSlot?: EquipmentSlot,
    ): boolean;
  }
}

/**
 * Tries to equip an item from a source.
 *
 * NOTE:
 *   This method doesn't check if the source is available for the player.
 */
alt.Player.prototype.equipItem = function (source, equipmentSlot) {
  const item = findItem(source, this);

  if (!item) {
    alt.log(`[equipItem] Item not found in source: ${JSON.stringify(source)}`);
    return false;
  }

  const isFromQuickSlot =
    source.origin === ItemSourceOrigin.PlayerEquipment &&
    [
      EquipmentSlot.QuickSlot1,
      EquipmentSlot.QuickSlot2,
      EquipmentSlot.QuickSlot3,
      EquipmentSlot.QuickSlot4,
    ].includes(source.equipmentSlot);

  const isToQuickSlot = [
    EquipmentSlot.QuickSlot1,
    EquipmentSlot.QuickSlot2,
    EquipmentSlot.QuickSlot3,
    EquipmentSlot.QuickSlot4,
  ].includes(equipmentSlot);

  const equipmentSlotOrFishingBait = isToQuickSlot
    ? equipmentSlot
    : isItemFishingBait(item)
      ? "fishing-bait"
      : getItemEquipmentSlot(item);

  if (!equipmentSlotOrFishingBait) {
    alt.log(`[equipItem] Item ${item.key} doesn't have equipment slot.`);
    return false;
  }

  const hasInventory =
    source.origin === ItemSourceOrigin.PlayerInventory ||
    source.origin === ItemSourceOrigin.Storage;

  const inventory = hasInventory ? findInventoryByItemSource(source) : null;

  if (hasInventory && !inventory) {
    alt.log(`[equipItem] Inventory not found for source: ${JSON.stringify(source)}`);
    return false;
  }

  if (equipmentSlotOrFishingBait === "fishing-bait") {
    if (
      !useFishingBaitOnFishingRod(
        {
          equipmentSlot: EquipmentSlot.Weapon,
          origin: ItemSourceOrigin.PlayerEquipment,
          originId: this.character.id,
        },
        source,
      )
    ) {
      return false;
    }
  }
  // Normal flow
  else {
    const equipmentSlot = equipmentSlotOrFishingBait;

    if (
      isItemKeyClothing(item.key) &&
      // If player gender doesn't match with clothing gender, don't equip
      ((this.model === alt.hash("mp_f_freemode_01") &&
        isMaleClothing(item.key) &&
        !isUnisexClothing(item.key)) ||
        (this.model === alt.hash("mp_m_freemode_01") &&
          !isMaleClothing(item.key) &&
          !isUnisexClothing(item.key)))
    ) {
      alt.log(`[equipItem] Player model doesn't match with clothing`);
      return false;
    }

    removeItem(source);

    const unequippedItem = this.character.equipment[equipmentSlot];

    const isSameAmmo = unequippedItem && isMatchingItem(unequippedItem, item, ItemMatchFlags.IGNORE_AMOUNT);

    if (isSameAmmo) {
      // @ts-expect-error
      this.character.equipment[equipmentSlot].amount += item.amount;
    } else {
      if (unequippedItem && !isFromQuickSlot) {
        if (inventory) {
          if (!addItemToInventory(inventory, unequippedItem)) {
            alt.log(`[equipItem] Failed to add unequipped item to inventory`);
            return false;
          }
        } else {
          dropItemOnTheGround(unequippedItem, this.pos);
        }
      }

      // @ts-expect-error item is guaranteed to be of correct type,
      // but TS is complaining that e.g. ClothingItem might be on weapon slot
      this.character.equipment[equipmentSlot] = item;

      if (isFromQuickSlot) {
        // @ts-expect-error
        this.character.equipment[source.equipmentSlot] = unequippedItem;
      }
    }

    if (unequippedItem) {
      emit(ServerEvents.FromServer.ITEM_UNEQUIP, this, equipmentSlot, unequippedItem);
    }
  }

  if (!isToQuickSlot) {
    emit(ServerEvents.FromServer.ITEM_EQUIP, this, item);
  }
  return true;
};
