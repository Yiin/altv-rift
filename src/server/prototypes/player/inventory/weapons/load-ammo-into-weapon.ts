import alt from "alt-server";
import { createItem, getItemData, getItemInfoByKey, toEquipedAmmo } from "@shared/modules/items";
import { AmmoItem, FirearmWeaponItem, InventoryItem } from "@shared/interfaces";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    loadAmmoIntoWeapon(
      this: InGamePlayer,
      ammo: InventoryItem<AmmoItem>,
      weapon: FirearmWeaponItem
    ): void;
  }
}

alt.Player.prototype.loadAmmoIntoWeapon = function (ammo, weapon) {
  this.removeItemFromSlot(ammo.slot);

  const weaponData = getItemData(weapon);
  const { clipSize } = getItemInfoByKey(weapon.key);

  if (!weaponData.ammo) {
    // No ammo, equip new ammo
    weaponData.ammo = toEquipedAmmo(ammo.data, clipSize);
  } else {
    const previousAmmo = weaponData.ammo;

    if (previousAmmo.key !== ammo.data.key) {
      // Unequip previous ammo
      weaponData.ammo = null;

      // Add previous ammo to the inventory
      this.addItem(createItem(previousAmmo.key, previousAmmo.clip));
      this.addItem(createItem(previousAmmo.key, previousAmmo.rest));

      // Equip new ammo
      weaponData.ammo = toEquipedAmmo(ammo.data, clipSize);
    } else {
      // Add ammo to the current ammo
      weaponData.ammo = toEquipedAmmo(ammo.data, clipSize, weaponData.ammo);
    }
  }
};
