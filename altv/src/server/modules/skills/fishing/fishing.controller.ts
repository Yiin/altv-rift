import alt from "@altv/server";
import _ from "lodash";
import { ServerCall } from "@shared/calls/server";
import { FishingGameType, PlayerFlags } from "@shared/store/game-state.store";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { catchAFish, startFishing, stopFishing } from "./fishing.api";

rpc.registerClient(ServerCall.FromClient.START_FISHING, (player) => {
  needsToBeInGame(player);

  return startFishing(player);
});

rpc.registerClient(ServerCall.FromClient.STOP_FISHING, (player) => {
  needsToBeInGame(player);

  return stopFishing(player);
});

rpc.registerClient(ServerCall.FromClient.REGISTER_KEY_PRESS, (player, key) => {
  needsToBeInGame(player);

  const isCatchingAFish = player.gameState.flags.has(PlayerFlags.IsCatchingAFish);

  if (!isCatchingAFish) {
    return;
  }

  switch (player.gameState.fishingProgress?.gameType) {
    case FishingGameType.TimeClick: {
      const currentTime = Date.now();
      const { startedAt, durationMs, targetPosition, targetSize } =
        player.gameState.fishingProgress;

      const timePassed = (currentTime - startedAt) / durationMs;

      // target limits
      const errorMargin = (player.ping + 50) / durationMs;
      const min = targetPosition - targetSize / 2;
      const max = targetPosition + targetSize / 2;

      const minAdjusted = Math.max(0, min - Math.max(0, max - 1) - errorMargin);
      const maxAdjusted = Math.min(1, max + Math.min(0, 1 + min) + errorMargin);

      const hitTheTarget = timePassed >= minAdjusted && timePassed <= maxAdjusted;

      if (hitTheTarget) {
        catchAFish(player, player.gameState.fishingProgress.baitKey);
      } else {
        stopFishing(player);
      }
      break;
    }
  }
});
