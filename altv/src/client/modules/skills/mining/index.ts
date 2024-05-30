import { PlayerFlags } from "@shared/store/game-state.store";
import { ActionType, ClientFlags } from "@shared/store/client.store";
import { gameState } from "@/core/store/game-state.store";
import { clientState } from "@/core/store/client.store";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { registerActions } from "@/core/user-interface/elements";
import { startDiggingTask, stopDiggingTask } from "./utils/digging-task";
import { trackCanDigFlag } from "./utils/track-can-dig-flag";

whileInGame(() => {
  const stopTracking = trackCanDigFlag();

  return () => {
    stopTracking();
  };
});

registerActions(() => {
  const actions = [];

  if (gameState.flags.has(PlayerFlags.IsDigging)) {
    actions.push({
      item: {
        type: ActionType.DIGGING,
        title: "Stop digging",
      },
      onSelect() {
        stopDiggingTask();
      },
    });
  } else if (clientState.flags.has(ClientFlags.CanDig)) {
    actions.push({
      item: {
        type: ActionType.DIGGING,
        title: "Start digging",
      },
      onSelect() {
        startDiggingTask();
      },
    });
  }

  return actions;
});
