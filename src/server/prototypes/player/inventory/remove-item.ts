import alt from "@altv/server";
import { ItemKey } from "@shared/modules/items";
import { getInventoryItemByKey, removeItemFromInventorySlot } from "@shared/modules/inventory";
import { InGamePlayer } from "@/core/utility/assertions";

declare module "@altv/server" {
  export interface Player {
    removeInventoryItemByKey<T extends ItemKey>(
      this: InGamePlayer,
      key: T,
      amount?: number,
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
