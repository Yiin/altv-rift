import alt from "alt-server";
import { getItemData, getItemInfoByKey } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/weapons/firearms";
import { InGamePlayer, isInGame } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    reloadWeapon(this: InGamePlayer): boolean;
  }
}

alt.Player.prototype.reloadWeapon = function () {
  const weapon = this.store.character.equipment.weapon;

  if (!weapon) {
    return false;
  }

  if (!isItemFirearmWeapon(weapon)) {
    return false;
  }

  const weaponData = getItemData(weapon);

  if (!weaponData.ammo) {
    return false;
  }

  const weaponInfo = getItemInfoByKey(weapon.key);
  const ammo = weaponData.ammo;

  if (ammo.clip.amount >= weaponInfo.clipSize) {
    return false;
  }

  const rest = ammo.rest.amount;

  if (rest <= 0) {
    return false;
  }

  setTimeout(() => {
    if (this.valid && isInGame(this) && this.isReloading) {
      const amount = Math.min(weaponInfo.clipSize - ammo.clip.amount, rest);

      ammo.rest.amount -= amount;
      ammo.clip.amount += amount;
    }
  }, 1000);

  return true;
};
