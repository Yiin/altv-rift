import alt from "alt-client";
import game from "natives";

alt.on("spawned", handleSpawned);

function handleSpawned() {
  game.setPedCanSwitchWeapon(alt.Player.local.scriptID, false);
}
