import alt from "@altv/server";
import _ from "lodash";
import { ServerCall } from "@shared/calls/server";
import { FishingGameType, PlayerFlags } from "@shared/store/game-state.store";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { catchAFish, startFishing, stopCatchingAFish, stopFishing } from "./fishing.api";
import { sendChatMessage } from "@/modules/chat";

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

  if (key === alt.Enums.KeyCode.MOUSE_RIGHT) {
    stopFishing(player);
    return;
  }

  if (key !== alt.Enums.KeyCode.MOUSE_LEFT) {
    return;
  }

  switch (player.gameState.fishingProgress?.gameType) {
    case FishingGameType.TimeClick: {
      const currentTime = Date.now();
      const { startedAt, durationMs, targetPosition, targetSize } =
        player.gameState.fishingProgress;

      const timePassed = ((currentTime - startedAt) % durationMs) / durationMs; // 0 - 1

      // Calculate the range boundaries
      const min = targetPosition - targetSize / 2;
      const max = targetPosition + targetSize / 2;

      // Account for ping
      const errorMargin = player.ping * 2;

      // Helper function to normalize value to 0-1 range
      const normalize = (value: number) => ((value % 1) + 1) % 1;

      // Apply normalization to all values
      const timeNorm = normalize(timePassed);

      // Expand the target range by the error margin
      const minWithError = normalize(min - errorMargin);
      const maxWithError = normalize(max + errorMargin);

      // Check if the range wraps around
      const isWrapped = minWithError > maxWithError;

      const hitTheTarget = isWrapped
        ? timeNorm >= minWithError || timeNorm <= maxWithError // Handle wraparound case
        : timeNorm >= minWithError && timeNorm <= maxWithError; // Normal case

      if (hitTheTarget) {
        catchAFish(player, player.gameState.fishingProgress.baitKey);
      } else {
        // For wrapped ranges, explain which side of the wrap we missed
        const missReason = isWrapped
          ? timeNorm > maxWithError && timeNorm < minWithError
            ? `Click (${timeNorm.toFixed(3)}) was in dead zone between max (${maxWithError.toFixed(3)}) and min (${minWithError.toFixed(3)})`
            : `Click timing error - should be ≥${minWithError.toFixed(3)} or ≤${maxWithError.toFixed(3)}`
          : timeNorm < minWithError
            ? `Click too early: ${timeNorm.toFixed(3)} < ${minWithError.toFixed(3)}`
            : `Click too late: ${timeNorm.toFixed(3)} > ${maxWithError.toFixed(3)}`;

        sendChatMessage(
          player,
          `MISS - ${missReason} | wrapped: ${isWrapped} | target: ${targetPosition.toFixed(3)} | size: ${targetSize.toFixed(3)} | err margin: ${(errorMargin / durationMs).toFixed(3)}`,
        );
        stopCatchingAFish(player);
      }
      break;
    }
  }
});
