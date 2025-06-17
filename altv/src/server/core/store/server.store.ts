import alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { getDefaultServerStoreState } from "@shared/store/server.store";
import { reactive } from "@yiin/reactive-proxy-state";

export const serverState = reactive(getDefaultServerStoreState(), (event) => {
  alt.Events.emitAllPlayersRaw(ClientEvents.FromServer.UPDATE_SERVER_STATE, event);
});
