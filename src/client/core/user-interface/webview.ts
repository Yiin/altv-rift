import alt from "alt-client";
import game from "natives";
import { serialize } from "alpha-serializer";
import { KeyCode } from "altv-enums";
import { ClientEvents } from "@shared/events/client";
import { Scene, UIElement } from "@shared/enums/ui";
import { createHookableFunction } from "@shared/hooks";
import { clientState } from "../store/client.store";
import { onKeyDown } from "../utility/event-helpers";

export const doesElementHaveCursor = createHookableFunction({
  name: "doesElementHaveCursor",
  defaultReturn: false,
});

class WebView extends alt.WebView {
  constructor(url: string, isOverlay = false) {
    super(url, isOverlay);
  }

  override emit(eventName: string, ...args: any[]) {
    super.emit(eventName, ...args.map((arg) => serialize(arg)));
  }
}

let url!: string;
let webview!: WebView;

// Make sure the webview is ready before we do anything with it.
let markWebViewAsReady!: () => void;
const ready = new Promise<void>((resolve) => {
  markWebViewAsReady = resolve;
});

export async function waitForUserInterface() {
  await ready;
}

/**
 * Kind of shitty typing here, but it is what it is.
 * Don't call getWebview() until the webview is ready or use getWebview((webview) => {...}).
 */
export function getWebview(): WebView;
export function getWebview(cb: (webview: WebView) => void): void;
export function getWebview(cb?: (webview: WebView) => void): WebView | void {
  if (cb) {
    ready.then(() => {
      cb(webview);
    });
  } else {
    return webview;
  }
}

let sceneCursorState = false;

export async function setScene(scene: Scene, { hasCursor }: { hasCursor: boolean }) {
  if (clientState.ui.scene && sceneCursorState) {
    sceneCursorState = false;
    showCursor(false);
  }

  clientState.ui.scene = scene;
  webview.url = `${url}#/${scene}`;

  if (hasCursor) {
    sceneCursorState = true;
    showCursor(true);
  }
}

export function toggleElement(element: UIElement, state?: boolean) {
  if (!webview) {
    return;
  }

  if (typeof state === "undefined") {
    toggleElement(element, !clientState.ui.elements.has(element));
  } else if (state) {
    clientState.ui.elements.add(element);

    if (doesElementHaveCursor.call(element)) {
      showCursor(true);
    }
  } else {
    clientState.ui.elements.delete(element);

    if (doesElementHaveCursor.call(element)) {
      showCursor(false);
    }
  }
}

export function showCursor(state: boolean) {
  try {
    alt.showCursor(state);
  } catch {}

  alt.nextTick(() => {
    if (alt.isCursorVisible()) {
      webview.focus();
      alt.toggleGameControls(false);
    } else {
      alt.toggleGameControls(true);
      webview.unfocus();
    }
  });
}

export function clearCursor() {
  let cursorCount = 0;
  while (true) {
    try {
      alt.showCursor(false);
      cursorCount++;
    } catch {
      break;
    }
  }

  alt.toggleGameControls(true);
  webview.unfocus();
  return cursorCount;
}

let clearedCursors = 0;

onKeyDown(KeyCode.Z, () => {
  if (alt.isCursorVisible()) {
    clearedCursors = clearCursor();
  } else {
    for (let i = 0; i < clearedCursors; i++) {
      alt.showCursor(true);
    }
  }
});

alt.onServer(
  ClientEvents.FromServer.SETUP_WEBVIEW,
  (webviewUrl = `http://resource/client/webview/index.html`) => {
    url = webviewUrl;

    if (url.includes("localhost")) {
      alt.logWarning(
        `Running WebService in Development Mode. Nobody can see these pages but the host computer.`
      );
    }

    if (webview) {
      webview.destroy();
    }

    webview = new WebView(`${url}#/`, false);

    webview.on(ClientEvents.FromWebview.VIEW_READY, () => {
      webview.focus();
      markWebViewAsReady();
    });
    webview.on(ClientEvents.FromWebview.PLAY_SOUND, (audioName: string, ref: string) => {
      game.playSoundFrontend(-1, audioName, ref, true);
    });
  }
);

alt.on("disconnect", () => {
  webview && webview.valid && webview.destroy();
});
