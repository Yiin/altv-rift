import * as alt from "@altv/server";
import { isInGame } from "@/core/utility/assertions";

alt.Events.onPlayerDisconnect(async ({ player, reason }) => {
  alt.log(`Player ${player.name} disconnected. Reason: ${reason}`);

  if (!isInGame(player)) {
    return;
  }

  await player.saveCharacter();
});
