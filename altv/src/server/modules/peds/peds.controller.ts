import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";

alt.Events.onPlayer(ServerEvents.FromClient.CONVERSATION_STARTED, (player, pedRemoteId) => {
  const ped = alt.Ped.getByID(pedRemoteId);

  if (!ped) {
    return;
  }

  ped.taskTurnPedToFaceCoord(player.pos, 2000);
});
