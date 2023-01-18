import natives from "natives";
import { SCREEN_EFFECTS } from "@shared/enums/screenEffects";

export const ScreenEffect = {
  /**
   * Check whether the specific screen effect is running.
   */
  isEffectActive(screenEffect: SCREEN_EFFECTS) {
    return natives.animpostfxIsRunning(screenEffect);
  },

  /**
   * Starts applying the specified effect to the screen.
   */
  startEffect(screenEffect: SCREEN_EFFECTS, duration = 0, looped = false) {
    natives.animpostfxPlay(screenEffect, duration, looped);
  },

  /**
   * Stops applying the specified effect to the screen.
   */
  stopEffect(screenEffect: SCREEN_EFFECTS) {
    natives.animpostfxStop(screenEffect);
  },

  /**
   * Stops all currently running effects.
   */
  stopAllEffects() {
    natives.animpostfxStopAll();
  },
};
