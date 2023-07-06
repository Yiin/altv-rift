import alt from "alt-client";
import game from "natives";
import { ServerEvents } from "@shared/events/server";
import { StreamedNpc } from "../ped";

export function stopRunningTask(this: StreamedNpc) {
  if (this.runningTask || this.taskIsRunning) {
    game.clearPedTasksImmediately(this.ped);
    this.runningTask = undefined;
    this.taskIsRunning = false;

    if (this.netOwned) {
      alt.emitServerRaw(ServerEvents.FromClient.STOP_NPC_TASK, this.npc.id);
    }
  }
}
