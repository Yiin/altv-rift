import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { createItem, getItemData } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
  export interface Player {
    unloadAmmo(this: InGamePlayer, slot: number): void;
  }
}

alt.Player.prototype.unloadAmmo = function (slot) {
  const item = this.getInventoryItemInSlot(slot);

  if (!item) {
    return;
  }

  if (item.data.type !== ItemType.FIREARM_WEAPON) {
    return;
  }

  const itemData = getItemData(item.data);

  if (!itemData.ammo) {
    return;
  }

  const ammo = itemData.ammo;

  if (this.addItem(createItem(ammo.key, ammo.clip))) {
    itemData.ammo.clip.amount = 0;
  }
  if (this.addItem(createItem(ammo.key, ammo.rest))) {
    itemData.ammo.rest.amount = 0;
  }
  if (!itemData.ammo.clip.amount && !itemData.ammo.rest.amount) {
    itemData.ammo = null;
  }
};
