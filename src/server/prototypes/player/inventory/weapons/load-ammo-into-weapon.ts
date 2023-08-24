import alt from "alt-server";
import { createItem, getItemData, toEquipedAmmo } from "@shared/modules/items";
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

  if (!weaponData.ammo) {
    console.log(`Weapon ${weapon.key} has no ammo, equipping new ammo`);
    // No ammo, equip new ammo
    weaponData.ammo = toEquipedAmmo(ammo.data);
  } else {
    const previousAmmo = weaponData.ammo;

    if (previousAmmo.key !== ammo.data.key) {
      console.log(
        `Weapon ${weapon.key} already has ammo ${previousAmmo.key}, replacing with ${ammo.data.key}`
      );
      // Unequip previous ammo
      weaponData.ammo = null;

      // Add previous ammo to the inventory
      this.addItem(createItem(previousAmmo.key, previousAmmo.data));

      // Equip new ammo
      weaponData.ammo = toEquipedAmmo(ammo.data);
    } else {
      console.log(
        `Weapon ${weapon.key} already has ammo ${previousAmmo.key}, adding ${ammo.data.key} to it`
      );
      // Add ammo to the current ammo
      weaponData.ammo.data.amount += toEquipedAmmo(ammo.data).data.amount;
    }
  }
  console.log(`Debug:`, toEquipedAmmo(ammo.data));
  console.log(`Weapon ${weapon.key} now has ${weaponData.ammo.data.amount} ammo`);
};
