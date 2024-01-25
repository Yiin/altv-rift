import { ItemSourceOrigin } from "@shared/interfaces";
import { getShop } from "@/modules/shops";
import { canInteractWithItemSource } from "../api/hooks";
import { droppedItems } from "../api/dropped-items";

canInteractWithItemSource.hook((player, itemSource) => {
  switch (itemSource.origin) {
    case ItemSourceOrigin.Character: {
      return player.character.id === itemSource.originId;
    }
    case ItemSourceOrigin.Shop: {
      const shop = getShop(itemSource.originId);
      if (!shop) {
        return false;
      }

      return player.pos.distanceTo(shop.ped.pos) < 5;
    }
    case ItemSourceOrigin.Global: {
      const ve = droppedItems.get(itemSource.originId);

      if (!ve) {
        return false;
      }

      return player.pos.distanceTo(ve.pos) < 5;
    }
    default: {
      return;
    }
  }
});
