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

// rpc.registerClient(ServerCall.FromClient.)

rpc.registerClient(ServerCall.FromClient.REGISTER_KEY_PRESS, (player, key) => {
  needsToBeInGame(player);

  const isCatchingAFish = player.gameState.flags.has(PlayerFlags.IsCatchingAFish);

  if (!isCatchingAFish) {
    console.log(`Player is not catching a fish.`);
    return;
  }

  switch (player.gameState.fishingProgress?.gameType) {
    case FishingGameType.TimeClick: {
      const currentTime = Date.now();
      const startedAt = player.gameState.fishingProgress.startedAt;
      const durationMs = player.gameState.fishingProgress.durationMs;
      const target = player.gameState.fishingProgress.target;

      const timePassed = (currentTime - startedAt) / durationMs;
      const min = target - 0.1;
      const max = target + 0.1;

      if (timePassed < min || timePassed > max) {
        console.log(`Player clicked too early or too late.`);
        stopFishing(player);
      } else {
        console.log(`Player clicked at the right time.`);
        catchAFish(player, player.gameState.fishingProgress.baitKey);
      }
      break;
    }
    case FishingGameType.Keys: {
      const keysRequired = player.gameState.fishingProgress.keys;
      const pressedKeys = player.gameState.fishingProgress.pressedKeys;

      pressedKeys.push(key);

      console.log(`Player pressed a key.`, alt.Enums.KeyCode[key]);

      if (_.isEqual(keysRequired, pressedKeys)) {
        console.log(`Player caught a fish.`);
        catchAFish(player, player.gameState.fishingProgress.baitKey);
      } else {
        const keysToValidate = keysRequired.slice(0, pressedKeys.length);
        if (!_.isEqual(keysToValidate, pressedKeys)) {
          console.log(`Player pressed the wrong key.`);
          // Player pressed the wrong key
          stopFishing(player);
        }
      }
      break;
    }
  }
});
