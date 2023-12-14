import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { watchEffect } from "vue";
import { ClientFlags } from "@shared/store/client.store";
import { PlayerFlags } from "@shared/store/game-state.store";
import { clientState } from "@/core/store/client.store";
import { gameState } from "@/core/store/game-state.store";
import { stopDiggingTask } from "./digging-task";

export function trackCanDigFlag() {
  return watchEffect(() => {
    if (!gameState.flags.has(PlayerFlags.InDiggingArea)) {
      clientState.flags.delete(ClientFlags.CanDig);
    } else {
      clientState.flags.add(ClientFlags.CanDig);
    }
    if (gameState.flags.has(PlayerFlags.IsDigging) && !clientState.flags.has(ClientFlags.CanDig)) {
      stopDiggingTask();
    }
  });
}
