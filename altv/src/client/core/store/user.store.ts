import alt from "@altv/client";
import { ref } from "@yiin/reactive-proxy-state";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { User } from "@shared/interfaces";
import { useWebview } from "@/core/user-interface/webview";
import { reactive, updateState } from "@yiin/reactive-proxy-state";

let userState: User | null = null;

export const isUserStoreAvailable = ref(false);

alt.Events.onServer(ClientEvents.FromServer.UPDATE_USER_STATE, (event: any) => {
  useWebview((webview) => webview.emitRaw(WebviewEvents.FromClient.UPDATE_USER_STATE, event));

  if (!userState) {
    const state = {} as User;
    updateState(state, event);
    userState = reactive(state as User);
    isUserStoreAvailable.value = true;
  } else {
    updateState(userState, event);
  }
});

export function useUser() {
  if (!userState) {
    throw new Error("User store is not ready.");
  }
  return userState;
}
