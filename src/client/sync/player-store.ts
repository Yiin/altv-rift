import alt from "alt-client";
import { updateStoreState } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { getWebview } from "@/utility/user-interface";
import { playerStore } from "@/store/player.store";

alt.onServer(ClientEvents.FromServer.UPDATE_PLAYER_STATE, (event: any) => {
  getWebview().emit(WebviewEvents.FromClient.UPDATE_PLAYER_STATE, event);

  updateStoreState(playerStore, event);
});

alt.onServer(ClientEvents.FromServer.SET_PLAYER_STATE, (state: any) => {
  playerStore.$state = state;
});
