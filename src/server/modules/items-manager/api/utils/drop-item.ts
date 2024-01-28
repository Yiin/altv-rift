import * as alt from "@altv/server";
import { PlayerItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";
import { dropItemOnTheGround } from "../dropped-items";
import { findItem } from "./find-item";
import { removeItem } from "./remove-item";

export function dropItem(player: InGamePlayer, source: PlayerItemSource, pos?: alt.IVector3) {
  if (source.origin === ItemSourceOrigin.PlayerEquipment) {
    const item = findItem(source, player);

    if (!item) {
      return false;
    }

    player.removeEquipedItem(source.equipmentSlot);

    dropItemOnTheGround(item, pos ?? player.pos);
    return true;
  }

  const item = removeItem(source);

  if (!item) {
    return false;
  }

  dropItemOnTheGround(item, pos ?? player.pos);

  return true;
}