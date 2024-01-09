import { getShop } from "@/modules/shops";
import { canInteractWithItemSource } from "../api/hooks";

canInteractWithItemSource.hook((player, itemSource) => {
  switch (itemSource.origin) {
    case "character": {
      return player.character.id === itemSource.originId;
    }
    case "shop": {
      const shop = getShop(itemSource.originId);
      if (!shop) {
        return false;
      }

      return player.pos.distanceTo(shop.ped.pos) < 5;
    }
    default: {
      return;
    }
  }
});
