import alt from "alt-client";
import { updateStoreState } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { serverStore } from "@/store/server.store";

alt.onServer(ClientEvents.FromServer.UPDATE_SERVER_STATE, (event: any) => {
  updateStoreState(serverStore, event);
});

alt.onServer(ClientEvents.FromServer.SET_SERVER_STATE, (state: any) => {
  serverStore.$state = state;
});
