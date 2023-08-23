import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { Equipment } from "@shared/interfaces";
import { getItemInfoByKey } from "@shared/modules/items";
import { InGamePlayer } from "@/rpc/checks";

declare module "alt-server" {
  export interface Player {
    unequipItem(this: InGamePlayer, equipmentSlot: keyof Equipment): void;
  }
}

alt.Player.prototype.unequipItem = function (equipmentSlot) {
  const item = this.store.character.equipment[equipmentSlot];

  if (!item) {
    return;
  }

  switch (item.type) {
    case ItemType.FIREARM_WEAPON:
    case ItemType.THROWABLE_WEAPON:
    case ItemType.MELEE_WEAPON:
      const { hash } = getItemInfoByKey(item.key);
      this.removeWeapon(hash);
      this.addItem(item);
      this.store.character.equipment.ammo = null;
      break;
  }
  this.store.character.equipment[equipmentSlot] = null;
};
