import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";

alt.onServer(ClientEvents.FromServer.PLAYER_RELOAD, handleReload);

const player = alt.Player.local;

export function handleReload() {
  let attempts = 0;
  const interval = alt.setInterval(() => {
    const [_unk, _hash] = game.getCurrentPedWeapon(player, null, false);
    if (player.vehicle) {
      alt.clearInterval(interval);
      game.setAmmoInClip(player, _hash, 9999);
      return;
    }

    if (attempts >= 4) {
      alt.clearInterval(interval);
      game.setAmmoInClip(player, _hash, 9999);
      return;
    }

    if (game.isPedReloading(player)) {
      alt.clearInterval(interval);
      game.setAmmoInClip(player, _hash, 9999);
    } else {
      game.setAmmoInClip(player, _hash, 1);
      game.makePedReload(player);
      attempts += 1;
    }
  }, 100);
}
