import alt from "@altv/server";

alt.Events.onPlayerDeath(({ player }) => {
  alt.Timers.setTimeout(() => {
    if (!player.valid) {
      return;
    }
    alt.log("Respawning player");
    player.spawn(player.pos, 0);
  }, 2000);
});

alt.Events.onPlayerHeal(({}) => {});
