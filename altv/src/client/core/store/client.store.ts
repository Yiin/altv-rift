import { defineStore } from "pinia";
import { getDefaultClientStoreState } from "@shared/store/client.store";
import { subscribeToStore } from "@shared/store/utils";
import { WebviewEvents } from "@shared/events/webview";
import { useWebview } from "@/core/user-interface/webview";
import { pinia } from ".";

const useClient = defineStore("client", {
  state: getDefaultClientStoreState,
});

export const clientState = useClient(pinia);

subscribeToStore(clientState, {
  onSetState: (state) => {
    useWebview((webView) => webView.emitRaw(WebviewEvents.FromClient.SET_CLIENT_STATE, state));
  },
  onUpdateState: (payload) => {
    console.log("Updating client state", payload);
    useWebview((webView) => webView.emitRaw(WebviewEvents.FromClient.UPDATE_CLIENT_STATE, payload));
  },
});
