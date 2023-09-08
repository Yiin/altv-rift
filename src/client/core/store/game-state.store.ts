import alt from "alt-client";
import { defineStore } from "pinia";
import { updateStoreState } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { getDefaultGameState } from "@shared/store/game-state.store";
import { WebviewEvents } from "@shared/events/webview";
import { getWebview } from "@/core/user-interface/webview";
import { pinia } from ".";

const useGameState = defineStore("game-state", {
  state: getDefaultGameState,
});

export const gameState = useGameState(pinia);

alt.onServer(ClientEvents.FromServer.UPDATE_GAME_STATE, (event: any) => {
  getWebview().emit(WebviewEvents.FromClient.UPDATE_GAME_STATE, event);

  updateStoreState(gameState, event);
});

alt.onServer(ClientEvents.FromServer.SET_GAME_STATE, (state: any) => {
  getWebview().emit(WebviewEvents.FromClient.SET_GAME_STATE, state);

  gameState.$state = state;
});
