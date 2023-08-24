import alt from "alt-server";
import { CombineType, getCombineType } from "@shared/modules/items";
import { AmmoItem, FirearmWeaponItem, InventoryItem } from "@shared/interfaces";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    loadAmmo(this: InGamePlayer, slotA: number, slotB: number): void;
  }
}

alt.Player.prototype.loadAmmo = function (slotA, slotB) {
  const itemA = this.getInventoryItemInSlot(slotA);
  const itemB = this.getInventoryItemInSlot(slotB);

  if (!itemA || !itemB) {
    console.log("No item in slot");
    return;
  }

  const [combination, reverse] = getCombineType(itemA.data.key, itemB.data.key);

  if (combination !== CombineType.EquipAmmo) {
    console.log("Items can't be combined");
    return;
  }

  const [weapon, ammo] = reverse ? [itemB, itemA] : [itemA, itemB];

  console.log(`Loading ammo ${ammo.data.key} into weapon ${weapon.data.key}`);
  this.loadAmmoIntoWeapon(ammo as InventoryItem<AmmoItem>, weapon.data as FirearmWeaponItem);
};
