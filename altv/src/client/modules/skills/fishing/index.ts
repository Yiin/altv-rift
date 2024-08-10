import alt from "@altv/client";
import { FishingGameType, PlayerFlags } from "@shared/store/game-state.store";
import { ActionTipType, ActionType, ClientFlags } from "@shared/store/client.store";
import { ServerCall } from "@shared/calls/server";
import { gameState } from "@/core/store/game-state.store";
import { clientState } from "@/core/store/client.store";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { registerActions } from "@/core/user-interface/elements";
import { rpc } from "@/core/rpc";
import { startFishingTask, stopFishingTask } from "./utils/fishing-task";
import { trackCanFishFlag } from "./utils/track-can-fish-flag";
import { isTyping } from "@/core/user-interface/event-helpers";

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
    if (!clientState.actionTip) {
      clientState.actionTip = {
        type: ActionTipType.FISHING,
      };
    }
    actions.push({
      item: {
        type: ActionType.FISHING,
        title: "Start fishing",
      },
      onSelect() {
        startFishingTask();
      },
    });
  } else {
    if (clientState.actionTip?.type === ActionTipType.FISHING) {
      clientState.actionTip = null;
    }
  }

  return actions;
});

alt.Events.onKeyDown(({ key }) => {
  if (isTyping()) {
    return;
  }

  if (gameState.fishingProgress?.gameType === FishingGameType.TimeClick) {
    if (key === alt.Enums.KeyCode.MOUSE_LEFT) {
      rpc.callServer(ServerCall.FromClient.REGISTER_KEY_PRESS, key);
    }
  }
});
