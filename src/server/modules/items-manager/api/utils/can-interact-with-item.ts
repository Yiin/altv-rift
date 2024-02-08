import { ItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";
import { droppedItems } from "../dropped-items";
import { getInteractionInventory } from "../../interaction-inventory.registry";

export function canInteractWithItemSource(player: InGamePlayer, itemSource: ItemSource) {
  switch (itemSource.origin) {
    case ItemSourceOrigin.PlayerInventory:
    case ItemSourceOrigin.PlayerEquipment:
      console.log(player.character.id, '===', itemSource.originId, player.character.id === itemSource.originId);
      return player.character.id === itemSource.originId;
    case ItemSourceOrigin.InteractionInventory: {
      const ve = getInteractionInventory(itemSource.originId);
      if (!ve) {
        return false;
      }

      return player.pos.distanceTo(ve.pos) < 5;
    }
    case ItemSourceOrigin.Ground: {
      const ve = droppedItems.get(itemSource.originId);

      if (!ve) {
        console.log('no ve', itemSource.originId, [...droppedItems.keys()]);
        return false;
      }

      console.log('distance', player.pos.distanceTo(ve.pos) < 8, player.pos.distanceTo(ve.pos));
      return player.pos.distanceTo(ve.pos) < 8;
    }
    default: {
      return true;
    }
  }
}
