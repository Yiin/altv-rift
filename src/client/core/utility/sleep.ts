import alt from "alt-client";

/**
 * Sleep the code for a certain duration.
 * Does not block other code unless you want it to.
 */
export function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    const timeout = alt.setTimeout(() => {
      alt.clearTimeout(timeout);
      return resolve();
    }, duration);
  });
}
