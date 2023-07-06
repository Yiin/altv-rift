import game from "natives";
import { Timer } from "./timers";

let everyTickControls: number | undefined;
let everyTickAttacks: number | undefined;

/**
 * Completely disabled all local player controls.
 */
export function disableAllControls(value: boolean) {
  if (everyTickControls) {
    Timer.clearInterval(everyTickControls);
    everyTickControls = undefined;
  }

  if (value) {
    everyTickControls = Timer.createInterval(
      handleDisablingControls,
      0,
      "disableControls.ts - All"
    );
  }
}

export function disableAllAttacks(value: boolean) {
  if (everyTickAttacks) {
    Timer.clearInterval(everyTickAttacks);
    everyTickAttacks = undefined;
  }

  if (value) {
    everyTickAttacks = Timer.createInterval(
      handleDisablingAttacks,
      0,
      "disableControls.ts - Attacks"
    );
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
