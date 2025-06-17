import alt from "@altv/client";
import { ClientEvents } from "@shared/events/client";
import { getDefaultServerStoreState } from "@shared/store/server.store";
import { reactive, updateState } from "@yiin/reactive-proxy-state";

const serverState = reactive(getDefaultServerStoreState);

alt.Events.onServer(ClientEvents.FromServer.UPDATE_SERVER_STATE, (event: any) => {
  updateState(serverState, event);
});

export function useServerState() {
  return serverState;
}
