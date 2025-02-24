import alt from "@altv/server";
import { ItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";

export function canInteractWithItemSource(player: InGamePlayer, itemSource: ItemSource): boolean {
  switch (itemSource.origin) {
    case ItemSourceOrigin.PlayerInventory:
    case ItemSourceOrigin.PlayerEquipment:
      return player.character.id === itemSource.originId;
    case ItemSourceOrigin.Storage: {
      const ve = alt.VirtualEntity.getByID(itemSource.originId);

      if (!ve) {
        alt.log("storage ve not found");
        return false;
      }

      if (player.pos.distanceTo(ve.pos) > 5) {
        alt.log("storage too far away");
        return false;
      }

      return true;
    }
    case ItemSourceOrigin.Ground: {
      const ve = alt.VirtualEntity.getByID(itemSource.originId);

      if (!ve) {
        alt.log("ground item ve not found");
        return false;
      }

      if (player.pos.distanceTo(ve.pos) > 5) {
        alt.log("ground item too far away");
        return false;
      }

      return true;
    }
    default: {
      return true;
    }
  }
}
