import * as alt from "@altv/client";
import game from "@altv/natives";
import { watchEffect } from "vue";
import { ClientFlags } from "@shared/store/client.store";
import { PlayerFlags } from "@shared/store/game-state.store";
import { clientState } from "@/core/store/client.store";
import { gameState } from "@/core/store/game-state.store";
import { stopFishingTask } from "./fishing-task";
import { testProbeAgainstWaterInFrontOfPlayer } from "./test-probe-against-water-in-front-of-player";

export function trackCanFishFlag() {
  let waterTestingTick: alt.Timers.EveryTick | undefined;

  return watchEffect(() => {
    if (!gameState.flags.has(PlayerFlags.InFishingArea)) {
      if (waterTestingTick) {
        waterTestingTick.destroy();
        waterTestingTick = undefined;
      }
    } else {
      waterTestingTick ??= alt.Timers.everyTick(() => {
        if (game.isPedSwimming(alt.Player.local)) {
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
