import { defineStore } from "pinia";
import {
  getDefaultClientStoreState,
  WorldUIElement,
} from "@shared/store/client.store";
import { subscribeToStore } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { getWebview } from "@/utility/user-interface";
import { pinia } from ".";

const useClient = defineStore("client", {
  state: getDefaultClientStoreState,
  actions: {
    addWorldUIElement<T extends WorldUIElement>(element: T) {
      this.worldUIElements[element.id] = element;
    },
    updateWorldUIElement<T extends WorldUIElement>(
      changes: Pick<T, "id"> & Partial<T>
    ) {
      const { id, ...rest } = changes;
      const element = this.worldUIElements[id];
      if (!element) return;
      Object.assign(element, rest);
    },
    removeWorldUIElement(id: string) {
      delete this.worldUIElements[id];
    },
  },
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
