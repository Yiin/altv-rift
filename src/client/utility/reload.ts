import alt from "alt-client";
import native from "natives";
import { ClientEvents } from "@shared/events/client";

alt.onServer(ClientEvents.FromServer.PLAYER_RELOAD, handleReload);

function handleReload() {
  let attempts = 0;
  const interval = alt.setInterval(() => {
    const [_unk, _hash] = native.getCurrentPedWeapon(
      alt.Player.local.scriptID,
      null,
      false
    );
    if (alt.Player.local.vehicle) {
      alt.clearInterval(interval);
      native.setAmmoInClip(alt.Player.local.scriptID, _hash, 9999);
      return;
    }

    if (attempts >= 4) {
      alt.clearInterval(interval);
      native.setAmmoInClip(alt.Player.local.scriptID, _hash, 9999);
      return;
    }

    if (native.isPedReloading(alt.Player.local.scriptID)) {
      alt.clearInterval(interval);
      native.setAmmoInClip(alt.Player.local.scriptID, _hash, 9999);
    } else {
      native.setAmmoInClip(alt.Player.local.scriptID, _hash, 1);
      native.makePedReload(alt.Player.local.scriptID);
      attempts += 1;
    }
  }, 100);
}
