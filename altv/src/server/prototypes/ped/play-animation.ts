import alt from "@altv/server";

declare module "@altv/server" {
  interface Ped {
    playAnimation(dict: string, name: string, speed: number, duration: number): void;
  }
}

alt.Ped.prototype.playAnimation = function (dict, name, speed, duration) {
  if (!this.valid) {
    return;
  }

  this.streamSyncedMeta.task = {
    type: "animation",
    dict,
    name,
    speed,
    duration,
  };
};
