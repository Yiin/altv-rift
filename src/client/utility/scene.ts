import alt from "alt-client";
import game from "natives";
import { Timer } from "./timers";

export function loadSceneAtCoords(pos: alt.IVector3): Promise<boolean> {
  let timerHandle: number;
  return new Promise<boolean>((resolve) => {
    // noinspection JSSuspiciousNameCombination
    game.newLoadSceneStartSphere(
      pos.x,
      pos.y,
      pos.z ?? game.getApproxHeightForPoint(pos.x, pos.y),
      2,
      1
    );

    timerHandle = Timer.createInterval(
      () => {
        if (!game.isNewLoadSceneActive()) {
          return resolve(false);
        }

        if (!game.isNewLoadSceneLoaded()) {
          return;
        }

        return resolve(true);
      },
      10,
      "scene.ts"
    );
  }).finally(() => {
    game.newLoadSceneStop();
    Timer.clearInterval(timerHandle);
  });
}
