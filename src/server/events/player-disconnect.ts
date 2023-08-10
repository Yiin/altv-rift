import alt from "alt-server";
import { minutesToMilliseconds } from "date-fns";

alt.on("playerDisconnect", async (player: alt.Player, reason: string) => {
  alt.log(`Player ${player.name} disconnected. Reason: ${reason}`);

  if (!player.store?.isLoggedIn) {
    return;
  }

  await player.saveCharacter();
});
