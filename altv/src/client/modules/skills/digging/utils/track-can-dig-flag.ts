import alt from "@altv/client";
import game from "@altv/natives";
import { watchEffect } from "@yiin/reactive-proxy-state";
import { ClientFlags } from "@shared/store/client.store";
import { PlayerFlags } from "@shared/store/game-state.store";
import { clientState } from "@/core/store/client.store";
import { useGameState } from "@/core/store/game-state.store";
import { stopDiggingTask } from "./digging-task";

export function trackCanDigFlag() {
  const gameState = useGameState();
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
