import { Consumable } from "@shared/modules/items";
import { useItem } from "../api/hooks";

useItem.hook((player, item) => {
  if (item.key !== Consumable.SIMPLE_MEDKIT) {
    return;
  }

  const character = player.character;

  console.log("Healing player", player.health, player.maxHealth);
  player.health = Math.min(player.health + 20, player.maxHealth);
  // player.health = character.health + 100;

  return 1;
});
