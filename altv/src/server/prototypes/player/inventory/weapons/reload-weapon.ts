import alt from "@altv/server";
import { createItem, getWeaponAmmoEquipmentSlot } from "@shared/modules/items";
import {
  getWeaponClipSize,
  isItemFirearmWeapon,
} from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { ItemMatchFlags, isMatchingItem } from "@shared/modules/inventory";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";
import { NotificationType } from "@shared/interfaces";

declare module "@altv/server" {
  export interface Player {
    reloadWeapon(this: InGamePlayer): boolean;
  }
}

alt.Player.prototype.reloadWeapon = function () {
  const weapon = this.character.equipment.weapon;

  if (!weapon) {
    return false;
  }

  if (!isItemFirearmWeapon(weapon)) {
    return false;
  }

  const clipSize = getWeaponClipSize(weapon.key);

  if (!clipSize) {
    // This weapon type has no clip
    return false;
  }

  if (weapon.clip && weapon.clip.amount >= clipSize) {
    // The clip is full
    this.notify(NotificationType.Warning, "Weapon clip is already full.");
    return false;
  }

  const ammoEquipmentSlot = getWeaponAmmoEquipmentSlot(weapon.key);

  const ammo = this.getEquipedItemInSlot(ammoEquipmentSlot);

  if (!ammo) {
    // No ammo equipped
    this.notify(NotificationType.Warning, "No ammo equipped.");
    return false;
  }

  const rest = ammo.amount;

  if (rest <= 0) {
    // No ammo left
    this.removeEquipedItem(ammoEquipmentSlot);
    this.notify(NotificationType.Warning, "No ammo left to reload.");
    return false;
  }

  if (weapon.clip && !isMatchingItem(ammo, weapon.clip, ItemMatchFlags.IGNORE_AMOUNT)) {
    // Ammo type doesn't match clip
    this.notify(NotificationType.Error, "Weapon clip and ammo type don't match.");
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
