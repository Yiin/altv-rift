import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { watchEffect } from "vue";
import { ServerCall } from "@shared/calls/server";
import { PlayerFlags } from "@shared/store/game-state.store";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { rpc } from "@/core/rpc";
import { gameState } from "@/core/store/game-state.store";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";

export let rodObject: alt.LocalObject["scriptID"] | null;

let stoppedFishingByServer = true;

export function getRodObject() {
  return rodObject;
}

export function resetRodObject() {
  rodObject = null;
}

whileInGame(() => {
  const stopWatching = watchEffect(() => {
    if (!gameState.flags.has(PlayerFlags.IsFishing) && stoppedFishingByServer) {
      removeRod();
    }
  });

  return () => {
    stopWatching();
  };
});

export async function startFishingTask() {
  if (rodObject) {
    removeRod();
  }
  await rpc.callServer(ServerCall.FromClient.START_FISHING);
  stoppedFishingByServer = true;

  everyTickWhile(
    () => !rodObject,
    () => {
      rodObject =
        alt.LocalObject.allWorld.find((obj) => {
          return (
            obj.pos.distanceTo(alt.Player.local.pos) <= 1.1 &&
            obj.model === alt.hash("prop_fishing_rod_01")
          );
        })?.scriptID ?? null;
    },
    () => {
      console.log("rodObject", rodObject);
    }
  );
}

export async function stopFishingTask() {
  stoppedFishingByServer = false;
  await rpc.callServer(ServerCall.FromClient.STOP_FISHING);

  removeRod();
}

function removeRod() {
  const rodObject = getRodObject();

  if (rodObject) {
    try {
      game.setEntityAsMissionEntity(rodObject, true, true);
      game.deleteEntity(rodObject);
    } finally {
      resetRodObject();
    }
  }
}
