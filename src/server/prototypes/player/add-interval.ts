import alt, { Player } from "alt-server";

declare module "alt-server" {
  export interface Player {
    addInterval: (
      this: Player,
      callback: (...args: any[]) => void,
      interval: number
    ) => number;
  }
}

Player.prototype.addInterval = function (callback, interval) {
  const id = alt.setInterval(() => {
    if (!this.valid) {
      alt.clearInterval(id);
      return;
    }
    callback();
  }, interval);

  return id;
};
