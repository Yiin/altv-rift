import alt from "alt-client";
import native from "natives";

alt.on("spawned", handleSpawned);

function handleSpawned() {
  native.setPedCanSwitchWeapon(alt.Player.local.scriptID, false);
}
