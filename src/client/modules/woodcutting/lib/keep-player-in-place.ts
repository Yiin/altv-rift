import alt from "alt-client";
import game from "natives";

let unfreezeAt = 0;

export function keepPlayerInPlace(keep: boolean) {
  if (keep) {
    game.freezeEntityPosition(alt.Player.local.scriptID, true);
    unfreezeAt = Date.now() + 1000;
  } else if (unfreezeAt && unfreezeAt < Date.now()) {
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    unfreezeAt = 0;
  }
}
