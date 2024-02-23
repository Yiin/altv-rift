import alt from "alt-server";

alt.on("playerConnect", (player) => {
  player.model = "csb_mweather";
  player.spawn(407.1560363769531, -2085.322998046875, 20.6864013671875, 0);
  player.rot = 180;
});
