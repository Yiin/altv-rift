import alt from "alt-client";
import native from "natives";
import { SWITCHOUT_TYPES } from "@shared/enums/switchOutTypes";
import { sleep } from "./sleep";

/**
 * Zoom all the way out. Then zoom all the way in from the sky.
 */
export async function switchToMultiSecondpart(
  duration: number,
  switchType: SWITCHOUT_TYPES = SWITCHOUT_TYPES.THREE_STEPS
): Promise<boolean> {
  if (!native.isPlayerSwitchInProgress()) {
    native.switchToMultiFirstpart(alt.Player.local.scriptID, 0, switchType);
  }

  await sleep(duration);

  native.switchToMultiSecondpart(alt.Player.local.scriptID);
  return true;
}
