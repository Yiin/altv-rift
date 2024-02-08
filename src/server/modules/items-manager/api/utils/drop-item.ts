import * as alt from "@altv/server";
import { PlayerItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";
import { dropItemOnTheGround } from "../dropped-items";
import { findItem } from "./find-item";
import { removeItem } from "./remove-item";

export function dropItem(player: InGamePlayer, source: PlayerItemSource, options: { pos?: alt.IVector3, amount?: number } = {}) {
  if (source.origin === ItemSourceOrigin.PlayerEquipment) {
    const item = findItem(source, player);

    if (!item) {
      return false;
    }

    player.removeEquipedItem(source.equipmentSlot);

    dropItemOnTheGround(item, options.pos ?? player.pos.sub(0, 0, 1.5));
    return true;
  }

  const item = removeItem(source, options.amount ?? 1);

  if (!item) {
    return false;
  }

  dropItemOnTheGround(item, options.pos ?? player.pos.sub(0, 0, 1.5));

  return true;
}