import * as alt from "@altv/client";
import game from "@altv/natives";

export async function loadModel(hash: number): Promise<boolean> {
  return await new Promise((resolve: Function) => {
    game.requestModel(hash);
    let count = 0;

    if (game.hasModelLoaded(hash)) {
      resolve(true);
      return;
    }

    const interval = alt.Timers.setInterval(() => {
      if (count >= 100) {
        resolve(false);
        interval.destroy();
        return;
      }

      if (!game.hasModelLoaded(hash)) {
        count += 1;
        return;
      }

      interval.destroy();
      resolve(true);
    }, 100);
  });
}
