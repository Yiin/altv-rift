import alt from "alt-server";
import { InGamePlayer } from "@/utility/assertions";
import { findSourceInventory } from "../api/hooks";

findSourceInventory.hook((source) => {
  if (source.source !== "character") {
    return null;
  }

  const player = alt.Player.all.find(
    (player): player is InGamePlayer => player.character?.id === source.sourceId
  );

  if (!player) {
    return null;
  }

  return player.character.inventory;
});
