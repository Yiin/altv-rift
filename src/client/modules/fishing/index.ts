import alt from "alt-client";
import { PlayerFlags } from "@shared/store/game-state.store";
import { ActionType, ClientFlags } from "@shared/store/client.store";
import { gameState } from "@/store/game-state.store";
import { clientState } from "@/store/client.store";
import { registerActions } from "@/user-interface/action-menu";
import { startFishingTask, stopFishingTask } from "./utils/fishing-task";
import { trackCanFishFlag } from "./utils/track-can-fish-flag";

alt.on("gameStart", () => {
  trackCanFishFlag();

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
});
