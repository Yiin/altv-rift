import alt from "@altv/client";
import { defineStore } from "pinia";
import { updateStoreState } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { getDefaultServerStoreState } from "@shared/store/server.store";
import { pinia } from ".";

const useServer = defineStore("server", {
  state: getDefaultServerStoreState,
});

export const serverStore = useServer(pinia);

alt.Events.onServer(ClientEvents.FromServer.UPDATE_SERVER_STATE, (event: any) => {
  updateStoreState(serverStore, event);
});

alt.Events.onServer(ClientEvents.FromServer.SET_SERVER_STATE, (state: any) => {
  serverStore.$state = state;
});
