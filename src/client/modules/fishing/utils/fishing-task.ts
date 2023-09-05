import alt from "alt-client";
import game from "natives";
import { ServerCall } from "@shared/calls/server";
import { everyTickWhile } from "@/utility/event-helpers";
import { rpc } from "@/rpc";

export let rodObject: alt.LocalObject | undefined;

export function getRodObject() {
  return rodObject;
}

export function resetRodObject() {
  rodObject = undefined;
}

export async function startFishingTask() {
  await rpc.callServer(ServerCall.FromClient.START_FISHING);

  everyTickWhile(
    () => !rodObject,
    () => {
      rodObject = alt.LocalObject.allWorld.find((obj) => {
        return (
          obj.pos.distanceTo(alt.Player.local.pos) <= 1.1 &&
          obj.model === alt.hash("prop_fishing_rod_01")
        );
      });
    }
  );
}

export async function stopFishingTask() {
  await rpc.callServer(ServerCall.FromClient.STOP_FISHING);

  const rodObject = getRodObject();

  if (rodObject) {
    game.setEntityAsMissionEntity(rodObject.scriptID, true, true);
    game.deleteEntity(rodObject.scriptID);
    resetRodObject();
  }
}
