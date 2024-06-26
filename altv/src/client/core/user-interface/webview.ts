import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { Scene, UIElement } from "@shared/enums/ui";
import { createHookableFunction } from "@shared/hooks";
import { serialize } from "@shared/utility/serializer";
import { WindowType } from "@shared/store/client.store";
import { ServerEvents } from "@shared/events/server";
import { clientState } from "../store/client.store";
import { GameControlReason, disableGameControls, enableGameControls, onKeyDown } from "./event-helpers";
import { Control, ControlType } from "../constants/controls";
import { hideRml, showRml } from "../rmlui/renderer/element-renderer";
import { disableControlActionsUntilKeyup } from "../utility/control-actions";

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

let url: string;
let webview: alt.WebView;
let cursors = 0;

// Make sure the webview is ready before we do anything with it.
let markWebViewAsReady: (webview: alt.WebView) => void;
const ready = new Promise<alt.WebView>((resolve) => {
  markWebViewAsReady = resolve;
});

export function waitForUserInterface() {
  return ready;
}

export function useWebview(fn: (webview: alt.WebView) => void) {
  ready.then(fn);
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

  if (typeof state === "undefined") {
    toggleElement(element, !clientState.ui.elements.has(element));
  } else if (state && !clientState.ui.elements.has(element)) {
    clientState.ui.elements.add(element);

    if (doesElementHaveCursor.call(element)) {
      showCursor(true);
    }
  } else if (clientState.ui.elements.has(element)) {
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
  } catch { }

  alt.Timers.nextTick(() => {
    if (cursors) {
      if (!alt.Cursor.visible) {
        for (let i = 0; i < cursors; i++) {
          alt.Cursor.visible = true;
        }
      }
      webview.focused = true;
      disableGameControls(GameControlReason.UI_WINDOW);
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

  enableGameControls(GameControlReason.UI_WINDOW);
  webview.focused = false;
  cursors = 0;
  return cursorCount;
}

export function toggleWindow(windowType: WindowType) {
  if (!clientState.ui.window || clientState.ui.window.type !== windowType) {
    if (clientState.ui.window) {
      closeWindow();
    }
    openWindow(windowType);
  } else {
    closeWindow();
  }
}

export function openWindow(windowType: WindowType) {
  clientState.ui.window = {
    type: windowType,
  };
  showCursor(true);

  hideRml();
}

export function closeWindow() {
  const closed = clientState.ui.window !== null;

  clientState.ui.window = null;
  showCursor(false);

  showRml();

  alt.Events.emitServer(ServerEvents.FromClient.CLOSE_WINDOW);

  return closed;
}

export function isWindowOpen(windowType?: WindowType) {
  if (!windowType) {
    return !!clientState.ui.window;
  }

  return clientState.ui.window?.type === windowType;
}

alt.Events.onKeyDown(({ key }) => {
  if (key === alt.Enums.KeyCode.ESCAPE) {
    const closed = closeWindow();

    /**
     * Temporarily disable the escape key to prevent the game
     * from pausing after closing the window.
     */
    if (closed) {
      disableControlActionsUntilKeyup(
        [
          [ControlType.FRONTEND_CONTROL, Control.INPUT_FRONTEND_PAUSE],
          [ControlType.FRONTEND_CONTROL, Control.INPUT_FRONTEND_PAUSE_ALTERNATE],
        ],
        alt.Enums.KeyCode.ESCAPE,
      );
    }
  }
});

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

alt.Events.onServer(
  ClientEvents.FromServer.SETUP_WEBVIEW,
  (webviewUrl = `http://resource/client/webview/index.html`) => {
    url = webviewUrl;

    console.log(`Loading Webview: ${url}`);

    if (url.includes("localhost")) {
      alt.logWarning(
        `Running WebService in Development Mode. Nobody can see these pages but the host computer.`,
      );
    }

    if (webview) {
      webview.destroy();
    }

    webview = alt.WebView.create({ url: `${url}#/`, overlay: false });

    console.log(`valid?`, webview.valid);

    webview.on('load', () => {
      console.log(`webview loaded`, webview.url);
    });

    webview.on(ClientEvents.FromWebview.VIEW_READY, () => {
      webview.focused = true;
      markWebViewAsReady(webview);
    });
    webview.on(ClientEvents.FromWebview.PLAY_SOUND, (audioName, ref) => {
      if (typeof ref === 'string') {
        game.playSoundFrontend(-1, audioName, ref, true);
      }
    });
    webview.on(ClientEvents.FromWebview.CLOSE_WINDOW, closeWindow);
  },
);
