import alt from "@altv/server";

declare module "@altv/server" {
  export interface Player {
    addInterval: (
      this: Player,
      callback: (...args: any[]) => void,
      interval: number,
    ) => alt.Timers.Interval;
  }
}

alt.Player.prototype.addInterval = function (callback, intervalMs) {
  const interval = alt.Timers.setInterval(() => {
    if (!this.valid) {
      interval.destroy();
      return;
    }
    callback();
  }, intervalMs);

  return interval;
};
