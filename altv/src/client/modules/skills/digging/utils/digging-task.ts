import alt from "@altv/client";
import game from "@altv/natives";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";

export let rodObject: alt.LocalObject["scriptID"] | null;

export function getRodObject() {
  return rodObject;
}

export function resetRodObject() {
  rodObject = null;
}

export async function startDiggingTask() {
  await rpc.callServer(ServerCall.FromClient.START_DIGGING);
}

export async function stopDiggingTask() {
  game.clearPedTasks(alt.Player.local);
  await rpc.callServer(ServerCall.FromClient.STOP_DIGGING);
}

alt.Events.onConsoleCommand(({ command }) => {
  if (command === "test") {
    alt.log(alt.Player.all.map((p) => p.name));
  }
});
