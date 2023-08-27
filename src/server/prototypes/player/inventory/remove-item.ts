import alt from "alt-server";
import { ItemKey } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";
import { getInventoryItemByKey, removeItemFromInventory } from "@/modules/items-manager";

declare module "alt-server" {
  export interface Player {
    removeInventoryItemByKey<T extends ItemKey>(
      this: InGamePlayer,
      key: T,
      amount?: number
    ): boolean;
  }
}

alt.Player.prototype.removeInventoryItemByKey = function (key, amount = 0) {
  const item = getInventoryItemByKey(this.store.character.inventory, key);

  if (!item) {
    return false;
  }

  return removeItemFromInventory(this.store.character.inventory, item.slot, amount) !== null;
};
