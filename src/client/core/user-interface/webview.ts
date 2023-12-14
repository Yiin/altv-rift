import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { Scene, UIElement } from "@shared/enums/ui";
import { createHookableFunction } from "@shared/hooks";
import { serialize } from "@shared/utility/serializer";
import { clientState } from "../store/client.store";
import { onKeyDown } from "../utility/event-helpers";

export const doesElementHaveCursor = createHookableFunction({
  name: "doesElementHaveCursor",
  defaultReturn: false,
});

declare module "@altv/client" {
  export interface WebView {
    emitRaw: WebView["emit"];
  }
}

alt.WebView.prototype.emitRaw = function (eventName: string, ...args: unknown[]) {
  return this.emit(eventName, serialize(args));
};

let url!: string;
let webview!: alt.WebView;
let cursors = 0;

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
export function getWebview(): alt.WebView;
export function getWebview(cb: (webview: alt.WebView) => void): void;
export function getWebview(cb?: (webview: alt.WebView) => void): alt.WebView | void {
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
  alt.log(`Setting Scene: ${scene}`);
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

  alt.log(`Toggling Element: ${element}, State: ${state}`);

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

export function showCursor(state?: boolean) {
  try {
    if (typeof state !== "undefined") {
      alt.Cursor.visible = state;
      cursors = Math.max(0, state ? cursors + 1 : cursors - 1);
    }
  } catch {}

  alt.Timers.nextTick(() => {
    if (cursors) {
      if (!alt.Cursor.visible) {
        for (let i = 0; i < cursors; i++) {
          alt.Cursor.visible = true;
        }
      }
      webview.focused = true;
      alt.setGameControlsActive(false);
    } else {
      clearCursor();
    }
  });
}

export function clearCursor() {
  let cursorCount = 0;
  while (alt.Cursor.visible) {
    try {
      alt.Cursor.visible = false;
      cursorCount++;
    } catch {
      break;
    }
  }

  alt.setGameControlsActive(true);
  webview.focused = false;
  cursors = 0;
  return cursorCount;
}

let clearedCursors = 0;

onKeyDown(alt.Enums.KeyCode.Z, () => {
  if (cursors) {
    clearedCursors = clearCursor();
  } else {
    for (let i = 0; i < clearedCursors; i++) {
      alt.Cursor.visible = true;
    }
  }
});

alt.Events.onWindowFocusChange(({ state }) => {
  alt.log(`Window Focus: ${state}, Cursors: ${cursors}`);
  showCursor();
});

alt.Events.onServer(
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

    webview = alt.WebView.create({ url: `${url}#/`, isOverlay: false });

    webview.on(ClientEvents.FromWebview.VIEW_READY, () => {
      webview.focused = true;
      markWebViewAsReady();
    });
    webview.on(ClientEvents.FromWebview.PLAY_SOUND, (audioName: string, ref: string) => {
      game.playSoundFrontend(-1, audioName, ref, true);
    });
  }
);

alt.Events.onDisconnect(() => {
  webview && webview.valid && webview.destroy();
});
