import alt from "@altv/server";
import { ItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";

export function canInteractWithItemSource(player: InGamePlayer, itemSource: ItemSource) {
  switch (itemSource.origin) {
    case ItemSourceOrigin.PlayerInventory:
    case ItemSourceOrigin.PlayerEquipment:
      return player.character.id === itemSource.originId;
    case ItemSourceOrigin.Storage: {
      const ve = alt.VirtualEntity.getByID(itemSource.originId);

      if (!ve) {
        return false;
      }

      return player.pos.distanceTo(ve.pos) < 5;
    }
    case ItemSourceOrigin.Ground: {
      const ve = alt.VirtualEntity.getByID(itemSource.originId);

      if (!ve) {
        return false;
      }

      return player.pos.distanceTo(ve.pos) < 5;
    }
    default: {
      return true;
    }
  }
}
