import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";

alt.Events.onServer(ClientEvents.FromServer.PLAYER_RELOAD, handleReload);

const player = alt.Player.local;

export function handleReload() {
  let attempts = 0;
  const interval = alt.Timers.setInterval(() => {
    const [_unk, _hash] = game.getCurrentPedWeapon(player, null, false);
    if (player.vehicle) {
      interval.destroy();
      game.setAmmoInClip(player, _hash, 9999);
      return;
    }

    if (attempts >= 4) {
      interval.destroy();
      game.setAmmoInClip(player, _hash, 9999);
      return;
    }

    if (game.isPedReloading(player)) {
      interval.destroy();
      game.setAmmoInClip(player, _hash, 9999);
    } else {
      game.setAmmoInClip(player, _hash, 1);
      game.makePedReload(player);
      attempts += 1;
    }
  }, 100);
}
