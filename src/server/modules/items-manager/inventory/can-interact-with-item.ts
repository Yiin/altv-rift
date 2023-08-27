import { canInteractWithItem } from "../api/hooks";

canInteractWithItem.hook((player, itemSource) => {
  if (itemSource.source !== "character") {
    return;
  }

  return player.store.character.id === itemSource.sourceId;
});
