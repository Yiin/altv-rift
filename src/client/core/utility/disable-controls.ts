import * as alt from "@altv/client";
import game from "@altv/natives";

let everyTickControls: alt.Timers.EveryTick | undefined;
let everyTickAttacks: alt.Timers.EveryTick | undefined;

/**
 * Completely disabled all local player controls.
 */
export function disableAllControls(value: boolean) {
  if (everyTickControls) {
    everyTickControls.destroy();
    everyTickControls = undefined;
  }

  if (value) {
    everyTickControls = alt.Timers.everyTick(handleDisablingControls);
  }
}

export function disableAllAttacks(value: boolean) {
  if (everyTickAttacks) {
    everyTickAttacks?.destroy();
    everyTickAttacks = undefined;
  }

  if (value) {
    everyTickAttacks = alt.Timers.everyTick(handleDisablingAttacks);
  }
}

export function handleDisablingAttacks() {
  game.disableControlAction(0, 24, true);
  game.disableControlAction(0, 25, true);
  game.disableControlAction(0, 47, true);
  game.disableControlAction(0, 53, true);
  game.disableControlAction(0, 54, true);
  game.disableControlAction(0, 58, true);
  game.disableControlAction(0, 66, true);
  game.disableControlAction(0, 67, true);
  game.disableControlAction(0, 68, true);
  game.disableControlAction(0, 69, true);
  game.disableControlAction(0, 70, true);
  game.disableControlAction(0, 92, true);
  game.disableControlAction(0, 114, true);
  game.disableControlAction(0, 140, true);
  game.disableControlAction(0, 141, true);
  game.disableControlAction(0, 142, true);
  game.disableControlAction(0, 257, true);
  game.disableControlAction(0, 263, true);
  game.disableControlAction(0, 264, true);
  game.disableControlAction(0, 331, true);
}

function handleDisablingControls() {
  game.disableAllControlActions(0);
  game.disableAllControlActions(1);
}
