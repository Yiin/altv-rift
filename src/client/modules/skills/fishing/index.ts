import alt from "@altv/client";
import { FishingGameType, PlayerFlags } from "@shared/store/game-state.store";
import { ActionType, ClientFlags } from "@shared/store/client.store";
import { ServerCall } from "@shared/calls/server";
import { gameState } from "@/core/store/game-state.store";
import { clientState } from "@/core/store/client.store";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { registerActions } from "@/core/user-interface/elements";
import { rpc } from "@/core/rpc";
import { startFishingTask, stopFishingTask } from "./utils/fishing-task";
import { trackCanFishFlag } from "./utils/track-can-fish-flag";

whileInGame(trackCanFishFlag);

registerActions(() => {
  const actions = [];

  if (gameState.flags.has(PlayerFlags.IsFishing)) {
    actions.push({
      item: {
        type: ActionType.FISHING,
        title: "Stop fishing",
      },
      onSelect() {
        stopFishingTask();
      },
    });
  } else if (clientState.flags.has(ClientFlags.CanFish)) {
    actions.push({
      item: {
        type: ActionType.FISHING,
        title: "Start fishing",
      },
      onSelect() {
        startFishingTask();
      },
    });
  }

  return actions;
});

alt.Events.onKeyDown(({ key }) => {
  if (gameState.fishingProgress?.gameType === FishingGameType.TimeClick) {
    if (key === alt.Enums.KeyCode.MOUSE_LEFT) {
      rpc.callServer(ServerCall.FromClient.REGISTER_KEY_PRESS, key);
    }
  }
});
