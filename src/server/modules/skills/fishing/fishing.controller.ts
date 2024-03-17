import alt from "@altv/server";
import _ from "lodash";
import { ServerCall } from "@shared/calls/server";
import { FishingGameType, PlayerFlags } from "@shared/store/game-state.store";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { catchAFish, startFishing, stopFishing } from "./api";

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
      const min = targetPosition - targetSize / 2 - errorMargin;
      const max = targetPosition + targetSize / 2 + errorMargin;

      const hitTheTarget = timePassed >= min && timePassed <= max;

      if (hitTheTarget) {
        catchAFish(player, player.gameState.fishingProgress.baitKey);
      } else {
        stopFishing(player);
      }
      break;
    }
    case FishingGameType.Keys: {
      const keysRequired = player.gameState.fishingProgress.keys;
      const pressedKeys = player.gameState.fishingProgress.pressedKeys;

      pressedKeys.push(key);

      if (_.isEqual(keysRequired, pressedKeys)) {
        catchAFish(player, player.gameState.fishingProgress.baitKey);
      } else {
        const keysToValidate = keysRequired.slice(0, pressedKeys.length);
        if (!_.isEqual(keysToValidate, pressedKeys)) {
          // Player pressed the wrong key
          stopFishing(player);
        }
      }
      break;
    }
  }
});
