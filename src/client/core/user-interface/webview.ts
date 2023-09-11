import alt, { Enums } from "@altv/client";
import game from "@altv/natives";
import { serialize } from "alpha-serializer";
import { WebviewEvents } from "@shared/events/webview";
import { ClientEvents } from "@shared/events/client";
import { ELEMENT, SCENE } from "@/core/constants/ui";
import { onKeyDown } from "../utility/event-helpers";
import { Elements } from "./elements";
import { Scenes } from "./scenes";

alt.WebView.prototype.emit = function (eventName: string, ...args: unknown[]) {
  this.emit(eventName, ...args.map((arg) => serialize(arg)));
};

let url!: string;
let webview!: alt.WebView;

/**
 * There can only be one active scene at a time.
 */
let currentScene!: SCENE;

/**
 * Active elements such as Inventory, Chat, etc. that does not depend on the scene.
 */
let activeElements = new Set<ELEMENT>();

/**
 * The amount of times the cursor has been shown. This is used to determine if the cursor should be hidden.
 * E.g. if the cursor is shown 3 times, then it should be hidden 3 times before it is actually hidden.
 */
let cursorCount = 0;

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

export async function setScene(scene: SCENE) {
  currentScene = scene;
  webview.url = `${url}#/${scene}`;

  if (Scenes[scene].hasCursor) {
    showCursor(true);
  } else {
    showCursor(false);
  }
}

export function toggleElement(element: ELEMENT, state: boolean) {
  if (!webview) {
    return;
  }

  if (!webview.url.startsWith(`${url}#/${SCENE.IN_GAME}`)) {
    return;
  }

  webview.emit(WebviewEvents.FromClient.TOGGLE_ELEMENT, element, state);

  if (state) {
    activeElements.add(element);

    if (Elements[element].hasCursor) {
      showCursor(true);
    }
  } else {
    activeElements.delete(element);

    if (Elements[element].hasCursor) {
      showCursor(false);
    }
  }
}

export function showCursor(state: boolean) {
  if (state) {
    cursorCount++;
    try {
      webview.focused = true;
      alt.Cursor.visible = true;
      alt.setGameControlsActive(false);
    } catch (err) { }
  } else {
    const activeElementsSupportingCursor = [...activeElements].filter(
      (element) => Elements[element].hasCursor
    );

    if (!activeElementsSupportingCursor.length && !Scenes[currentScene].hasCursor) {
      clearCursor();
    }
  }
}

export function clearCursor() {
  for (let i = 0; i < cursorCount; i++) {
    try {
      alt.Cursor.visible = false;
    } catch (err) { }
  }

  alt.setGameControlsActive(true);
  webview.focused = false;
  cursorCount = 0;
}

onKeyDown(Enums.KeyCode.Z, () => {
  if (cursorCount) {
    clearCursor();
  } else {
    const activeElementsSupportingCursor = [...activeElements].filter(
      (element) => Elements[element].hasCursor
    );
    if (activeElementsSupportingCursor.length || Scenes[currentScene].hasCursor) {
      showCursor(true);
    }
  }
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
