import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { ClientEvents } from "@shared/events/client";
import { angleToFaceTarget } from "@/core/utility/vector";
import { isInGame } from "@/core/utility/assertions";

declare module "@altv/server" {
  interface Ped {
    taskTurnPedToFaceCoord(pos: alt.IVector3, duration: number): void;
  }
}

alt.Ped.prototype.taskTurnPedToFaceCoord = function (pos, duration) {
  if (!this.netOwner) {
    this.rot = new alt.Vector3(0, 0, angleToFaceTarget(this.pos, pos));
    return;
  }

  this.netOwner.emitRaw(
    ClientEvents.FromServer.CALL_NATIVE,
    "taskTurnPedToFaceCoord",
    this,
    pos.x,
    pos.y,
    pos.z,
    duration,
  );
};

alt.Events.onPlayer(ServerEvents.FromClient.CONVERSATION_STARTED, (player, pedRemoteId) => {
  const ped = alt.Ped.getByID(pedRemoteId);

  if (!ped) {
    return;
  }

  ped.taskTurnPedToFaceCoord(player.pos, 2000);
});

alt.Events.onPlayer("clearquests", (player) => {
  if (isInGame(player)) {
    player.character.questFacts = [];
  }
});
