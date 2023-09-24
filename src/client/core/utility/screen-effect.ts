import * as game from "@altv/natives";
import { SCREEN_EFFECTS } from "@shared/modules/game/ui/screen-effects";

/**
 * Check whether the specific screen effect is running.
 */
export function isScreenEffectActive(screenEffect: SCREEN_EFFECTS) {
  return game.animpostfxIsRunning(screenEffect);
}

/**
 * Starts applying the specified effect to the screen.
 */
export function startScreenEffect(screenEffect: SCREEN_EFFECTS, duration = 0, looped = false) {
  game.animpostfxPlay(screenEffect, duration, looped);
}

/**
 * Stops applying the specified effect to the screen.
 */
export function stopScreenEffect(screenEffect: SCREEN_EFFECTS) {
  game.animpostfxStop(screenEffect);
}

/**
 * Stops all currently running effects.
 */
export function stopAllSceenEffects() {
  game.animpostfxStopAll();
}
