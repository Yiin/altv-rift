import { getDefaultClientStoreState } from "@shared/store/client.store";
import { WebviewEvents } from "@shared/events/webview";
import { useWebview } from "@/core/user-interface/webview";
import { reactive } from "@yiin/reactive-proxy-state";

export const clientState = reactive(getDefaultClientStoreState(), (event) => {
  useWebview((webView) => webView.emitRaw(WebviewEvents.FromClient.UPDATE_CLIENT_STATE, event));
});
