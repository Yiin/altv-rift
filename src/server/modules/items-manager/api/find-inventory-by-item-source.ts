import alt from "@altv/server";
import { Inventory, ItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";

export function findInventoryByItemSource(source: ItemSource): Inventory | null {
  if (source.origin === ItemSourceOrigin.PlayerInventory) {
    const player = alt.Player.all.find(
      (player): player is InGamePlayer => player.character?.id === source.originId
    );

    if (!player) {
      return null;
    }

    return player.character.inventory;
  }

  if (source.origin === ItemSourceOrigin.Storage) {
    return null;
  }
  return null;
};
