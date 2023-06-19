import alt from "alt-client";
import native from "natives";
import { KeyCode } from "altv-enums";
import { serialize } from "alpha-serializer";
import { WebviewEvents } from "@shared/events/webview";
import { ClientEvents } from "@shared/events/client";
import { ELEMENT, SCENE } from "@/constants/ui";
import { onKeyDown } from "../event-helpers";
import { Elements } from "./elements";
import { Scenes } from "./scenes";

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
      webview.focus();
      alt.showCursor(true);
      alt.toggleGameControls(false);
    } catch (err) {}
  } else {
    const activeElementsSupportingCursor = [...activeElements].filter(
      (element) => Elements[element].hasCursor
    );

    if (
      !activeElementsSupportingCursor.length &&
      !Scenes[currentScene].hasCursor
    ) {
      clearCursor();
    }
  }
}

export function clearCursor() {
  for (let i = 0; i < cursorCount; i++) {
    try {
      alt.showCursor(false);
    } catch (err) {}
  }

  alt.toggleGameControls(true);
  webview.unfocus();
  cursorCount = 0;
}

onKeyDown(KeyCode.Z, () => {
  if (cursorCount) {
    clearCursor();
  } else {
    const activeElementsSupportingCursor = [...activeElements].filter(
      (element) => Elements[element].hasCursor
    );
    if (
      activeElementsSupportingCursor.length ||
      Scenes[currentScene].hasCursor
    ) {
      showCursor(true);
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
    webview.on(
      ClientEvents.FromWebview.PLAY_SOUND,
      (audioName: string, ref: string) => {
        native.playSoundFrontend(-1, audioName, ref, true);
      }
    );
  }
);
alt.on("disconnect", () => {
  webview && webview.valid && webview.destroy();
});
