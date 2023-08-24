import alt from "alt-server";

alt.on("playerDeath", async (player: alt.Player, killer: alt.Entity | null, reason: number) => {
  setTimeout(() => {
    if (!player.valid) {
      return;
    }
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
  }, 2000);
});
