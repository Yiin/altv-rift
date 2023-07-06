import alt from "alt-client";
import game from "natives";
import { SWITCHOUT_TYPES } from "@shared/modules/game/ui/switch-out-types";
import { sleep } from "./sleep";

/**
 * Zoom all the way out. Then zoom all the way in from the sky.
 */
export async function switchToMultiSecondpart(
  duration: number,
  switchType: SWITCHOUT_TYPES = SWITCHOUT_TYPES.THREE_STEPS
): Promise<boolean> {
  if (!game.isPlayerSwitchInProgress()) {
    game.switchToMultiFirstpart(alt.Player.local.scriptID, 0, switchType);
  }

  await sleep(duration);

  game.switchToMultiSecondpart(alt.Player.local.scriptID);
  return true;
}
