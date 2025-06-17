import alt from "@altv/client";
import { ClientEvents } from "@shared/events/client";
import { GameState } from "@shared/store/game-state.store";
import { WebviewEvents } from "@shared/events/webview";
import { useWebview } from "@/core/user-interface/webview";
import { reactive, updateState } from "@yiin/reactive-proxy-state";

let gameState: GameState | null = null;

alt.Events.onServer(ClientEvents.FromServer.UPDATE_GAME_STATE, (event: any) => {
  useWebview((webview) => webview.emitRaw(WebviewEvents.FromClient.UPDATE_GAME_STATE, event));

  if (!gameState) {
    const state = {} as GameState;
    updateState(state, event);
    gameState = reactive(state as GameState);
  } else {
    updateState(gameState, event);
  }
});

export function useGameState() {
  if (!gameState) {
    throw new Error("Game state store is not ready.");
  }
  return gameState;
}
