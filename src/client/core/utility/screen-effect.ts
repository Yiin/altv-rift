import natives from "@altv/natives";
import { SCREEN_EFFECTS } from "@shared/modules/game/ui/screen-effects";

/**
 * Check whether the specific screen effect is running.
 */
export function isScreenEffectActive(screenEffect: SCREEN_EFFECTS) {
  return natives.animpostfxIsRunning(screenEffect);
}

/**
 * Starts applying the specified effect to the screen.
 */
export function startScreenEffect(screenEffect: SCREEN_EFFECTS, duration = 0, looped = false) {
  natives.animpostfxPlay(screenEffect, duration, looped);
}

/**
 * Stops applying the specified effect to the screen.
 */
export function stopScreenEffect(screenEffect: SCREEN_EFFECTS) {
  natives.animpostfxStop(screenEffect);
}

/**
 * Stops all currently running effects.
 */
export function stopAllSceenEffects() {
  natives.animpostfxStopAll();
}
