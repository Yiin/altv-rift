import alt from "@altv/server";
import _ from "lodash";
import { ServerCall } from "@shared/calls/server";
import { FishingGameType, PlayerFlags } from "@shared/store/game-state.store";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { catchAFish, startFishing, stopCatchingAFish, stopFishing } from "./fishing.api";
import { sendChatMessage } from "@/modules/chat";
import { NotificationType } from "@shared/interfaces";

rpc.registerClient(ServerCall.FromClient.START_FISHING, (player) => {
  needsToBeInGame(player);

  return startFishing(player);
});

rpc.registerClient(ServerCall.FromClient.STOP_FISHING, (player) => {
  needsToBeInGame(player);

  return stopFishing(player);
});

rpc.registerWebview(
  ServerCall.FromWebview.FISHING_CLICK_RESULT,
  (player, { isSuccess, rotation }) => {
    needsToBeInGame(player);

    const isCatchingAFish = player.gameState.flags.has(PlayerFlags.IsCatchingAFish);

    if (!isCatchingAFish) {
      player.notify(NotificationType.Warning, "Not catching a fish");
      return;
    }

    if (!player.gameState.fishingProgress) {
      return;
    }

    if (!isSuccess) {
      stopCatchingAFish(player);
      return;
    }

    if (rotation < 0 || rotation > 360) {
      return;
    }

    const { startedAt, durationMs, baitKey, targetPosition, targetSize } =
      player.gameState.fishingProgress;

    // Simple reasonableness checks, to be sure client didn't cheat
    if (Date.now() - startedAt > durationMs * 3) {
      player.notify(NotificationType.Warning, "Too late");
      return;
    }

    if (rotation < 0 || rotation > 360) {
      return;
    }

    const targetStart = targetPosition - targetSize / 2;

    if (rotation / 360 < targetStart) {
      player.notify(NotificationType.Warning, `Too early: ${rotation / 360} < ${targetStart}`);
      return;
    }

    if (rotation / 360 > targetStart + targetSize) {
      player.notify(
        NotificationType.Warning,
        `Too late: ${rotation / 360} > ${targetStart + targetSize}`,
      );
      return;
    }

    catchAFish(player, baitKey);
  },
);
