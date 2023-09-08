import alt from "alt-client";
import game from "natives";

export async function loadModel(hash: number): Promise<boolean> {
  return await new Promise((resolve: Function) => {
    game.requestModel(hash);
    let count = 0;

    if (game.hasModelLoaded(hash)) {
      resolve(true);
      return;
    }

    const interval = alt.setInterval(() => {
      if (count >= 100) {
        resolve(false);
        alt.clearInterval(interval);
        return;
      }

      if (!game.hasModelLoaded(hash)) {
        count += 1;
        return;
      }

      alt.clearInterval(interval);
      resolve(true);
    }, 100);
  });
}
