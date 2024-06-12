import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { angleToFaceTarget } from "@/core/utility/vector";

declare module "@altv/server" {
  interface Ped {
    taskTurnPedToFaceCoord(pos: alt.IVector3, duration: number): void;
    playAnimation(dict: string, name: string, speed: number, duration: number): void;
  }
}

alt.Ped.prototype.taskTurnPedToFaceCoord = function (pos) {
  this.rot = new alt.Vector3(0, 0, angleToFaceTarget(this.pos, pos));
};

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

alt.Events.onPlayer(ServerEvents.FromClient.CONVERSATION_STARTED, (player, pedRemoteId) => {
  const ped = alt.Ped.getByID(pedRemoteId);

  if (!ped) {
    return;
  }

  ped.taskTurnPedToFaceCoord(player.pos, 2000);
});
