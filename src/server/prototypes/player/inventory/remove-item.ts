import alt from "@altv/server";
import { ItemKey } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";
import { getInventoryItemByKey, removeItemFromInventorySlot } from "@/modules/items-manager";

declare module "@altv/server" {
  export interface Player {
    removeInventoryItemByKey<T extends ItemKey>(
      this: InGamePlayer,
      key: T,
      amount?: number
    ): boolean;
  }
}

alt.Player.prototype.removeInventoryItemByKey = function (key, amount = 0) {
  const item = getInventoryItemByKey(this.character.inventory, key);

  if (!item) {
    return false;
  }

  return removeItemFromInventorySlot(this.character.inventory, item.slot, amount) !== null;
};
