import alt from "alt-server";
import { getItemInfoByKey } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { InGamePlayer, isInGame } from "@/utility/assertions";

declare module "alt-server" {
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

  const ammo = weapon.ammo;

  if (!ammo) {
    return false;
  }

  const weaponInfo = getItemInfoByKey(weapon.key);

  if (ammo.clip >= weaponInfo.clipSize) {
    return false;
  }

  const rest = ammo.rest;

  if (rest <= 0) {
    return false;
  }

  setTimeout(() => {
    if (this.valid && isInGame(this) && this.isReloading) {
      const amount = Math.min(weaponInfo.clipSize - ammo.clip, rest);

      ammo.rest -= amount;
      ammo.clip += amount;
    }
  }, 1000);

  return true;
};
