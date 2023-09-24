import * as alt from "@altv/client";
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

alt.Events.onServer(ClientEvents.FromServer.UPDATE_GAME_STATE, (event: any) => {
  getWebview().emit(WebviewEvents.FromClient.UPDATE_GAME_STATE, event);

  alt.log("Updating game state", event, typeof event.target, event.target.constructor.name);
  updateStoreState(gameState, event);
});

alt.Events.onServer(ClientEvents.FromServer.SET_GAME_STATE, (state: any) => {
  getWebview().emit(WebviewEvents.FromClient.SET_GAME_STATE, state);

  alt.log("Setting game state", state);
  gameState.$state = state;
});
