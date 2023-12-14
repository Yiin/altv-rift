import * as alt from "@altv/server";
import { InGamePlayer } from "@/core/utility/assertions";
import { findSourceInventory } from "../api/hooks";

findSourceInventory.hook((source) => {
  if (source.origin !== "character") {
    return null;
  }

  const player = alt.Player.all.find(
    (player): player is InGamePlayer => player.character?.id === source.originId
  );

  if (!player) {
    return null;
  }

  return player.character.inventory;
});
