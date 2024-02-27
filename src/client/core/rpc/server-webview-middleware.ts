import alt from "@altv/client";
import {
  CALL_SERVER_FROM_WEBVIEW,
  CALL_SERVER_FROM_WEBVIEW_RESPONSE,
  CALL_WEBVIEW_FROM_SERVER,
  CALL_WEBVIEW_FROM_SERVER_RESPONSE,
} from "@shared/calls/constants";
import { deserialize } from "@shared/utility/serializer";
import { useWebview } from "@/core/user-interface/webview";

alt.Events.onServer(CALL_WEBVIEW_FROM_SERVER, async (payload) => {
  useWebview((webview) => {
    webview.emitRaw(CALL_WEBVIEW_FROM_SERVER, payload);
  });
});

useWebview((webview) => {
  webview.on(CALL_WEBVIEW_FROM_SERVER_RESPONSE, (response) => {
    alt.Events.emitServerRaw(CALL_WEBVIEW_FROM_SERVER_RESPONSE, deserialize(response));
  });

  webview.on(CALL_SERVER_FROM_WEBVIEW, (payload) => {
    [payload] = deserialize(payload);
    alt.Events.emitServerRaw(CALL_SERVER_FROM_WEBVIEW, payload);
  });
});

alt.Events.onServer(CALL_SERVER_FROM_WEBVIEW_RESPONSE, (response) => {
  useWebview((webview) => {
    webview.emitRaw(CALL_SERVER_FROM_WEBVIEW_RESPONSE, response);
  });
});
