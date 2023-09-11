import alt from "@altv/client";
import {
  CALL_SERVER_FROM_WEBVIEW,
  CALL_SERVER_FROM_WEBVIEW_RESPONSE,
  CALL_WEBVIEW_FROM_SERVER,
  CALL_WEBVIEW_FROM_SERVER_RESPONSE,
} from "@shared/calls/constants";
import { getWebview } from "@/core/user-interface/webview";

alt.Events.onServer(CALL_WEBVIEW_FROM_SERVER, async (payload) => {
  getWebview((webview) => {
    webview.emit(CALL_WEBVIEW_FROM_SERVER, payload);
  });
});

getWebview((webview) => {
  webview.on(CALL_WEBVIEW_FROM_SERVER_RESPONSE, (response) => {
    alt.Events.emitServer(CALL_WEBVIEW_FROM_SERVER_RESPONSE, response);
  });

  webview.on(CALL_SERVER_FROM_WEBVIEW, (payload) => {
    alt.Events.emitServer(CALL_SERVER_FROM_WEBVIEW, payload);
  });
});

alt.Events.onServer(CALL_SERVER_FROM_WEBVIEW_RESPONSE, (response) => {
  getWebview((webview) => {
    webview.emit(CALL_SERVER_FROM_WEBVIEW_RESPONSE, response);
  });
});
