import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { getItemInfoByKey, WeaponItemInfo } from "@shared/modules/items";
import { AmmoItem, InventoryItem } from "@shared/interfaces";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    findBaseAmmoForWeapon(this: InGamePlayer, weapon: WeaponItemInfo): AmmoItem | undefined;
  }
}

alt.Player.prototype.findBaseAmmoForWeapon = function (weapon: WeaponItemInfo) {
  if (weapon.itemType !== ItemType.FIREARM_WEAPON) {
    return;
  }

  const ammo = this.character.inventory.items.find(
    (inventoryItem): inventoryItem is InventoryItem<AmmoItem> => {
      return (
        inventoryItem.item.type === ItemType.AMMO &&
        getItemInfoByKey(inventoryItem.item.key).group === weapon.ammoGroup
      );
    }
  );

  return ammo?.item;
};
