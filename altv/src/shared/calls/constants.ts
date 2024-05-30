export const CALL_CLIENT_FROM_SERVER = "c:cs";
export const CALL_CLIENT_FROM_SERVER_RESPONSE = "r:cs";
export const CALL_WEBVIEW_FROM_SERVER = "c:ws";
export const CALL_WEBVIEW_FROM_SERVER_RESPONSE = "r:ws";
export const CALL_SERVER_FROM_CLIENT = "c:sc";
export const CALL_SERVER_FROM_CLIENT_RESPONSE = "r:sc";
export const CALL_WEBVIEW_FROM_CLIENT = "c:wc";
export const CALL_WEBVIEW_FROM_CLIENT_RESPONSE = "r:wc";
export const CALL_SERVER_FROM_WEBVIEW = "c:sw";
export const CALL_SERVER_FROM_WEBVIEW_RESPONSE = "r:sw";
export const CALL_CLIENT_FROM_WEBVIEW = "c:cw";
export const CALL_CLIENT_FROM_WEBVIEW_RESPONSE = "r:cw";

type CallPayload = {
  id: string;
  name: string;
  args: any;
};

type CallResultPayload = {
  id: string;
  error?: any;
  result?: any;
};

declare module "@altv/shared" {
  namespace Events {
    interface CustomServerToPlayerEvent {
      [CALL_CLIENT_FROM_SERVER]: (payload: CallPayload) => void;
      [CALL_WEBVIEW_FROM_SERVER]: (payload: CallPayload) => void;
      [CALL_SERVER_FROM_CLIENT_RESPONSE]: (payload: CallResultPayload) => void;
      [CALL_SERVER_FROM_WEBVIEW_RESPONSE]: (payload: CallResultPayload) => void;
    }

    interface CustomPlayerToServerEvent {
      [CALL_SERVER_FROM_CLIENT]: (payload: CallPayload) => void;
      [CALL_SERVER_FROM_WEBVIEW]: (payload: CallPayload) => void;
      [CALL_CLIENT_FROM_SERVER_RESPONSE]: (payload: CallResultPayload) => void;
      [CALL_WEBVIEW_FROM_SERVER_RESPONSE]: (payload: CallResultPayload) => void;
    }

    interface CustomClientToWebViewEvent {
      [CALL_WEBVIEW_FROM_CLIENT]: (payload: CallPayload) => void;
      [CALL_WEBVIEW_FROM_SERVER]: (payload: CallPayload) => void;
      [CALL_CLIENT_FROM_WEBVIEW_RESPONSE]: (payload: CallResultPayload) => void;
      [CALL_SERVER_FROM_WEBVIEW_RESPONSE]: (payload: CallResultPayload) => void;
    }

    interface CustomWebViewToClientEvent {
      [CALL_CLIENT_FROM_WEBVIEW]: (payload: CallPayload) => void;
      [CALL_SERVER_FROM_WEBVIEW]: (payload: CallPayload) => void;
      [CALL_WEBVIEW_FROM_CLIENT_RESPONSE]: (payload: CallResultPayload) => void;
      [CALL_WEBVIEW_FROM_SERVER_RESPONSE]: (payload: CallResultPayload) => void;
    }
  }
}
