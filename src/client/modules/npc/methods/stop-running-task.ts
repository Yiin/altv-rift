import alt from "alt-client";
import native from "natives";
import { Events } from "@shared/constants/events";
import { StreamedNpc } from "../ped";

export function stopRunningTask(this: StreamedNpc) {
  if (this.runningTask || this.taskIsRunning) {
    native.clearPedTasksImmediately(this.ped);
    this.runningTask = undefined;
    this.taskIsRunning = false;

    if (this.netOwned) {
      alt.emitServerRaw(Events.Server.STOP_NPC_TASK, this.npc.id);
    }
  }
}
