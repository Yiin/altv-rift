import * as alt from "@altv/client";
import * as game from "@altv/natives";

export const ClientParticles = {
  /**
   * It creates a particle effect at a given position, with a given scale, for a given duration.
   */
  async play(
    dict: string,
    name: string,
    scale: number,
    pos: alt.IVector3,
    duration: number = 5000,
    color: alt.RGBA = new alt.RGBA(255, 255, 255, 255),
    clearInstantly = false
  ): Promise<void> {
    if (name.includes("scr")) {
      return;
    }

    const interval = alt.Timers.setInterval(() => {
      game.useParticleFxAsset(dict);
      game.requestPtfxAsset();

      if (color) {
        game.setParticleFxNonLoopedColour(color.r, color.g, color.b);
      }

      game.startParticleFxNonLoopedAtCoord(
        name,
        pos.x,
        pos.y,
        pos.z,
        0,
        0,
        0,
        scale,
        false,
        false,
        false
      );
    }, 100);

    if (duration <= 0) {
      duration = 50;
    }

    return new Promise((resolve: Function) => {
      alt.Timers.setTimeout(() => {
        interval.destroy();

        if (clearInstantly) {
          game.removeParticleFxInRange(pos.x, pos.y, pos.z, 5);
        }

        resolve();
      }, duration);
    });
  },
};
