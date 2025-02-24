import alt from "@altv/client";
import { ClientEvents } from "@shared/events/client";
import { useWebview } from "./webview";
import { WebviewEvents } from "@shared/events/webview";

alt.Events.onServer(ClientEvents.FromServer.SHOW_NOTIFICATION, (type, title, options) => {
  useWebview((webview) =>
    webview.emit(WebviewEvents.FromClient.SHOW_NOTIFICATION, type, title, options),
  );
});
