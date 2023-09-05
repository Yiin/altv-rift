import alt from "alt-server";
import { Equipment, InventoryItemSource, ItemSource } from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import { getItemEquipmentSlot, getItemInfoByKey, isItemAmmo } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/weapons/firearms";
import { InGamePlayer } from "@/utility/assertions";
import {
  addItemToInventory,
  findItem,
  findSourceInventory,
  getInventoryItemByKey,
  loadWeaponWithAmmo,
  removeItem,
} from "@/modules/items-manager";

declare module "alt-server" {
  export interface Player {
    equipItem(this: InGamePlayer, source: InventoryItemSource): boolean;
  }
}

alt.Player.prototype.equipItem = function (source) {
  const item = findItem.call(source, this);

  if (!item) {
    return false;
  }

  const equipmentSlot = getItemEquipmentSlot(item);

  if (!equipmentSlot) {
    return false;
  }

  const inventory = findSourceInventory.call(source);

  if (!inventory) {
    return false;
  }

  // Ammo equipment is a special case
  if (equipmentSlot === "ammo" && isItemAmmo(item)) {
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
  } else {
    // Normal flow
    removeItem(source);

    const slot = equipmentSlot as Exclude<typeof equipmentSlot, "ammo">;

    const unequippedItem = this.character.equipment[slot];

    if (unequippedItem && !addItemToInventory(inventory, unequippedItem)) {
      return false;
    }

    // @ts-expect-error item is guaranteed to be of correct type,
    // but TS is complaining that e.g. ClothingItem might be on weapon slot
    this.character.equipment[slot] = item;

    if (slot === "weapon" && isItemFirearmWeapon(item)) {
      // Quick hack to auto-equip weapon ammo
      if (!item.FIREARM_WEAPON.ammo) {
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

  alt.emit(ServerEvents.FromServer.EQUIP_ITEM, this, item);
  return true;
};
