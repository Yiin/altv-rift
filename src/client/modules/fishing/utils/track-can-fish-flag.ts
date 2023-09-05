import alt from "alt-client";
import game from "natives";
import { watchEffect } from "vue";
import { ClientFlags } from "@shared/store/client.store";
import { PlayerFlags } from "@shared/store/game-state.store";
import { clientState } from "@/store/client.store";
import { gameState } from "@/store/game-state.store";
import { stopFishingTask } from "./fishing-task";
import { testProbeAgainstWaterInFrontOfPlayer } from "./test-probe-against-water-in-front-of-player";

export function trackCanFishFlag() {
  let waterTestingTick: number | undefined;

  watchEffect(() => {
    if (!gameState.flags.has(PlayerFlags.InFishingArea)) {
      if (waterTestingTick) {
        alt.clearEveryTick(waterTestingTick);
        waterTestingTick = undefined;
      }
    } else {
      waterTestingTick ??= alt.everyTick(() => {
        if (game.isPedSwimming(alt.Player.local.scriptID)) {
          clientState.flags.delete(ClientFlags.CanFish);
          return;
        }

        const { hit } = testProbeAgainstWaterInFrontOfPlayer();

        if (hit) {
          clientState.flags.add(ClientFlags.CanFish);
        } else {
          clientState.flags.delete(ClientFlags.CanFish);
        }
      });
    }

    if (gameState.flags.has(PlayerFlags.IsFishing) && !clientState.flags.has(ClientFlags.CanFish)) {
      stopFishingTask();
    }
  });
}
