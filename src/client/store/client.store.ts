import { defineStore } from "pinia";
import { getDefaultClientStoreState } from "@shared/store/client.store";
import { subscribeToStore } from "@shared/store/utils";
import { WebviewEvents } from "@shared/events/webview";
import { getWebview } from "@/utility/user-interface";
import { pinia } from ".";

const useClient = defineStore("client", {
  state: getDefaultClientStoreState,
});

export const clientStore = useClient(pinia);

subscribeToStore(clientStore, {
  onSetState: (state) => {
    getWebview((webView) =>
      webView.emit(WebviewEvents.FromClient.SET_CLIENT_STATE, state)
    );
  },
  onUpdateState: (payload) => {
    getWebview((webView) =>
      webView.emit(WebviewEvents.FromClient.UPDATE_CLIENT_STATE, payload)
    );
  },
});
