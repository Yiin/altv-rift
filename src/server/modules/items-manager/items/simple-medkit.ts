import { useItem } from "../api/hooks";

useItem.hook((player, item) => {
  if (item.key !== "simple_medkit") {
    return;
  }

  const character = player.character;

  character.health = Math.min(character.health + 20, character.maxHealth);

  return true;
});
