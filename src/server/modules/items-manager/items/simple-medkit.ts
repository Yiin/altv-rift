import { Consumable } from "@shared/modules/items";
import { useItem } from "../api";

useItem.hook((player, item) => {
  if (item.key !== Consumable.SIMPLE_MEDKIT) {
    return;
  }

  player.health = Math.min(player.health + 20, player.maxHealth);

  return 1;
});
