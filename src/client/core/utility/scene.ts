import * as alt from "@altv/client";
import * as game from "@altv/natives";

export function loadSceneAtCoords(pos: alt.IVector3): Promise<boolean> {
  let timerHandle: alt.Timers.Interval;
  const start = Date.now();

  return new Promise<boolean>((resolve) => {
    game.newLoadSceneStartSphere(
      pos.x,
      pos.y,
      pos.z ?? game.getApproxHeightForPoint(pos.x, pos.y),
      2,
      1
    );

    timerHandle = alt.Timers.setInterval(() => {
      if (!game.isNewLoadSceneActive()) {
        return resolve(false);
      }

      if (!game.isNewLoadSceneLoaded()) {
        if (Date.now() - start > 10000) {
          alt.logError("Failed to load scene");
          return resolve(false);
        }
        return;
      }

      return resolve(true);
    }, 10);
  }).finally(() => {
    game.newLoadSceneStop();
    timerHandle.destroy();
  });
}
