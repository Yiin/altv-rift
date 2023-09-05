import alt from "alt-client";
import { defineStore } from "pinia";
import { updateStoreState } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { getWebview } from "@/user-interface/webview";
import { pinia } from ".";

export const useUser = defineStore("player", {
  state: () => ({} as LoadedUser),
});

export const user = useUser(pinia);

alt.onServer(ClientEvents.FromServer.UPDATE_USER_STATE, (event: any) => {
  getWebview().emit(WebviewEvents.FromClient.UPDATE_USER_STATE, event);

  updateStoreState(user, event);
});

alt.onServer(ClientEvents.FromServer.SET_USER_STATE, (state: any) => {
  getWebview().emit(WebviewEvents.FromClient.SET_USER_STATE, event);

  user.$state = state;
});
