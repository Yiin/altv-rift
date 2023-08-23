import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { InventoryItem } from "@shared/interfaces";
import {
  getItemInfoByKey,
  getAmmoKeyForWeaponGroup,
  getItemData,
  WeaponItemKey,
  createItem,
  toEquipedAmmo,
  getItemEquipmentSlot,
} from "@shared/modules/items";
import { ServerEvents } from "@shared/events/server";
import { InGamePlayer } from "@/rpc/checks";

declare module "alt-server" {
  export interface Player {
    equipItem(this: InGamePlayer, item: InventoryItem): boolean;
  }
}

alt.Player.prototype.equipItem = function (itemToEquip) {
  const itemType = itemToEquip.data.type;

  const equipmentSlot = getItemEquipmentSlot(itemToEquip);

  if (equipmentSlot) {
    // remove item we want to equip from inventory
    this.removeItemFromSlot(itemToEquip.slot);

    // add currently equiped item to inventory
    this.unequipItem(equipmentSlot);

    // add item we want to equip to equipment slot
    this.store.character.equipment[equipmentSlot] = itemToEquip.data;
  }

  switch (itemType) {
    case ItemType.FIREARM_WEAPON:
    case ItemType.THROWABLE_WEAPON:
    case ItemType.MELEE_WEAPON:
      const weapon = getItemInfoByKey(itemToEquip.data.key);

      // equip weapon
      if (itemType === ItemType.MELEE_WEAPON) {
        this.giveWeapon(weapon.hash, 1, true);
      } else if (itemType === ItemType.THROWABLE_WEAPON) {
        const itemData = getItemData(itemToEquip.data);
        this.giveWeapon(weapon.hash, itemData.amount, true);
      } else {
        const baseAmmo = this.findBaseAmmoForWeapon(weapon);
        const ammo =
          getItemData(itemToEquip.data)?.ammo ??
          toEquipedAmmo(baseAmmo) ??
          (() => {
            const ammoKey = getAmmoKeyForWeaponGroup(weapon.group);
            const ammoItem = createItem(ammoKey, { amount: 1000 });
            const inventoryItem = this.addItem(ammoItem);
            return inventoryItem ? toEquipedAmmo(inventoryItem?.data) : null;
          })();

        const itemKey = itemToEquip.data.key as WeaponItemKey;

        if (!ammo) {
          return false;
        }

        console.log('Equiping weapon "' + itemKey + '" with ammo "' + ammo.key + '"');
        this.giveWeapon(weapon.hash, ammo.data.amount, true);
      }
      break;
  }

  alt.emit(ServerEvents.FromServer.EQUIP_ITEM, this, itemToEquip);
  return true;
};
