import alt from "alt-server";

alt.on("playerDisconnect", async (player: alt.Player, reason: string) => {
  alt.log(`Player ${player.name} disconnected. Reason: ${reason}`);

  if (!player.store.isLoggedIn) {
    return;
  }

  await player.saveCharacter();
});
