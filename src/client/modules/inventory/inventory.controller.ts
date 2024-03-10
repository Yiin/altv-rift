import alt from "@altv/client";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { useWebview } from "@/core/user-interface/webview";

alt.Events.onServer(ClientEvents.FromServer.INVENTORY_ITEM_ADD, (item) => {
  useWebview((webview) => webview.emit(WebviewEvents.FromClient.INVENTORY_ITEM_ADD, item));
});
