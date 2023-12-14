import { canInteractWithItemSource as canInteractWithSource } from "../api/hooks";

canInteractWithSource.hook((player, itemSource) => {
  if (itemSource.origin !== "character") {
    return;
  }

  return player.character.id === itemSource.originId;
});
