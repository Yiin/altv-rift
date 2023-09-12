import * as alt from "@altv/server";

alt.Events.onPlayerDeath(({ player }) => {
  setTimeout(() => {
    if (!player.valid) {
      return;
    }
    player.spawn(player.pos, 0);
  }, 2000);
});
