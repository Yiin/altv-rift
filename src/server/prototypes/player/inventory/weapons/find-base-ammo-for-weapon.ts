import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { getItemInfoByKey, WeaponItemInfo } from "@shared/modules/items";
import { AmmoItem, InventoryItem } from "@shared/interfaces";
import { InGamePlayer } from "@/rpc/checks";

declare module "alt-server" {
  export interface Player {
    findBaseAmmoForWeapon(this: InGamePlayer, weapon: WeaponItemInfo): AmmoItem | undefined;
  }
}

alt.Player.prototype.findBaseAmmoForWeapon = function (weapon: WeaponItemInfo) {
  const ammo = this.store.character.inventory.items.find(
    (inventoryItem): inventoryItem is InventoryItem<AmmoItem> => {
      return (
        inventoryItem.data.type === ItemType.AMMO &&
        getItemInfoByKey(inventoryItem.data.key).group === weapon.group
      );
    }
  );

  return ammo?.data;
};
