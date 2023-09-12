import * as alt from "@altv/client";

/**
 * Sleep the code for a certain duration.
 * Does not block other code unless you want it to.
 */
export function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    const timeout = alt.Timers.setTimeout(() => {
      timeout.destroy();
      return resolve();
    }, duration);
  });
}
