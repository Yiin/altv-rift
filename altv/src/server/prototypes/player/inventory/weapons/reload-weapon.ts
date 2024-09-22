import alt from "@altv/server";
import { createItem, getWeaponAmmoEquipmentSlot } from "@shared/modules/items";
import {
  getWeaponClipSize,
  isItemFirearmWeapon,
} from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { ItemMatchFlags, isMatchingItem } from "@shared/modules/inventory";
import { MessageType } from "@shared/modules/chat";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";
import { sendChatMessage } from "@/modules/chat";

declare module "@altv/server" {
  export interface Player {
    reloadWeapon(this: InGamePlayer): boolean;
  }
}

alt.Player.prototype.reloadWeapon = function () {
  const weapon = this.character.equipment.weapon;

  if (!weapon) {
    console.log("no weapon");
    return false;
  }

  if (!isItemFirearmWeapon(weapon)) {
    console.log("not a firearm weapon");
    return false;
  }

  const clipSize = getWeaponClipSize(weapon.key);

  if (!clipSize) {
    // This weapon type has no clip
    console.log("no clip size");
    return false;
  }

  if (weapon.clip && weapon.clip.amount >= clipSize) {
    // The clip is full
    console.log("clip is full", weapon.clip.amount, clipSize);
    return false;
  }

  const ammoEquipmentSlot = getWeaponAmmoEquipmentSlot(weapon.key);

  const ammo = this.getEquipedItemInSlot(ammoEquipmentSlot);

  if (!ammo) {
    // No ammo equipped
    console.log("no ammo equipped");
    return false;
  }

  const rest = ammo.amount;

  if (rest <= 0) {
    // No ammo left
    this.removeEquipedItem(ammoEquipmentSlot);
    console.log("no ammo left");
    return false;
  }

  if (weapon.clip && !isMatchingItem(ammo, weapon.clip, ItemMatchFlags.IGNORE_AMOUNT)) {
    // Ammo type doesn't match clip
    sendChatMessage(this, "Weapon clip and ammo type don't match.", MessageType.Error);
    return false;
  }

  setTimeout(() => {
    if (this.valid && isInGame(this) /* && this.isReloading */) {
      if (this.character.equipment.weapon !== weapon) {
        // Weapon has been changed
        return;
      }

      if (weapon.clip) {
        // Refill clip
        const amount = Math.min(clipSize - weapon.clip.amount, rest);

        if ((ammo.amount -= amount) <= 0) {
          this.removeEquipedItem(ammoEquipmentSlot);
        }
        weapon.clip.amount += amount;
      } else {
        // Create clip
        const amount = Math.min(clipSize, rest);

        if ((ammo.amount -= amount) <= 0) {
          this.removeEquipedItem(ammoEquipmentSlot);
        }
        weapon.clip = createItem(ammo.key, { ...ammo, amount });
      }
    }
  }, 1000);

  return true;
};
