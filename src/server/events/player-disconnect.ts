import alt from "alt-server";
import { isInGame } from "@/utility/assertions";

alt.on("playerDisconnect", async (player: alt.Player, reason: string) => {
  alt.log(`Player ${player.name} disconnected. Reason: ${reason}`);

  if (!isInGame(player)) {
    return;
  }

  await player.saveCharacter();
});
