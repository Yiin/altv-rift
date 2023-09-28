import * as alt from "@altv/server";
import { InGamePlayer } from "@/core/utility/assertions";
import { findInventorySource } from "../api";

findInventorySource.hook((inventory) => {
  const player = alt.Player.all.find(
    (p): p is InGamePlayer => p.character?.inventory === inventory
  );

  return player?.character ?? null;
});
