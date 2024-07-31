import alt from "@altv/client";
import game from "@altv/natives";

let unfreezeAt = 0;

export function keepPlayerInPlaceForMiningAction(keep: boolean) {
  if (keep) {
    game.freezeEntityPosition(alt.Player.local, true);
    unfreezeAt = Date.now() + 1000;
  } else if (unfreezeAt && unfreezeAt < Date.now()) {
    game.freezeEntityPosition(alt.Player.local, false);
    unfreezeAt = 0;
  }
}
