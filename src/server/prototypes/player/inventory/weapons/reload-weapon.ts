import alt from "@altv/server";
import { createItem, getWeaponAmmoEquipmentSlot } from "@shared/modules/items";
import { getWeaponClipSize, isItemFirearmWeapon } from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";

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
    return false;
  }

  const ammoEquipmentSlot = getWeaponAmmoEquipmentSlot(weapon.key);

  const ammo = this.getEquipedItemInSlot(ammoEquipmentSlot);

  if (!ammo) {
    // No ammo equipped
    return false;
  }

  const rest = ammo.amount;

  if (rest <= 0) {
    // No ammo left
    this.removeEquipedItem(ammoEquipmentSlot);
    return false;
  }

  setTimeout(() => {
    if (this.valid && isInGame(this) && this.isReloading) {
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
        weapon.clip = createItem(ammo.key, { amount });
      }
    }
  }, 1000);

  return true;
};
