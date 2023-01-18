import alt from "alt-client";
import native from "natives";

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

    const interval = alt.setInterval(() => {
      native.useParticleFxAsset(dict);
      native.requestPtfxAsset();

      if (color) {
        native.setParticleFxNonLoopedColour(color.r, color.g, color.b);
      }

      native.startParticleFxNonLoopedAtCoord(
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
      alt.setTimeout(() => {
        alt.clearInterval(interval);

        if (clearInstantly) {
          native.removeParticleFxInRange(pos.x, pos.y, pos.z, 5);
        }

        resolve();
      }, duration);
    });
  },
};
