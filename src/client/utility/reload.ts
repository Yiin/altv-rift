import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";

alt.onServer(ClientEvents.FromServer.PLAYER_RELOAD, handleReload);

export function handleReload() {
  let attempts = 0;
  const interval = alt.setInterval(() => {
    const [_unk, _hash] = game.getCurrentPedWeapon(alt.Player.local.scriptID, null, false);
    if (alt.Player.local.vehicle) {
      alt.clearInterval(interval);
      game.setAmmoInClip(alt.Player.local.scriptID, _hash, 9999);
      return;
    }

    if (attempts >= 4) {
      alt.clearInterval(interval);
      game.setAmmoInClip(alt.Player.local.scriptID, _hash, 9999);
      return;
    }

    if (game.isPedReloading(alt.Player.local.scriptID)) {
      alt.clearInterval(interval);
      game.setAmmoInClip(alt.Player.local.scriptID, _hash, 9999);
    } else {
      game.setAmmoInClip(alt.Player.local.scriptID, _hash, 1);
      game.makePedReload(alt.Player.local.scriptID);
      attempts += 1;
    }
  }, 100);
}
