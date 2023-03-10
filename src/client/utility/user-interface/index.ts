import alt from "alt-client";
import native from "natives";
import { KeyCode } from "altv-enums";
import { serialize } from "alpha-serializer";
import { Events } from "@shared/constants/events";
import { ELEMENT, SCENE } from "@shared/enums/ui";
import { onKeyDown } from "../event-helpers";
import { Elements } from "./elements";

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
let activeElements = new Set<ELEMENT>();
let cursorCount = 0;

// Make sure the webview is ready before we do anything with it.
let resolveReady!: () => void;
const ready = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

export async function waitForUserInterface() {
  await ready;
}

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
  webview.url = `${url}#/${scene}`;
}

export function toggleElement(element: ELEMENT, state: boolean) {
  if (!webview.url.startsWith(`${url}#/${SCENE.IN_GAME}`)) {
    return;
  }

  webview.emit(Events.Webview.TOGGLE_ELEMENT, element, state);

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

    if (!activeElementsSupportingCursor.length) {
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
    if (activeElementsSupportingCursor.length) {
      showCursor(true);
    }
  }
});

alt.onServer(
  Events.Client.SETUP_WEBVIEW,
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

    webview = new WebView(url, false);

    webview.on(Events.Webview.VIEW_READY, () => {
      webview.focus();
      resolveReady();
    });
    webview.on(Events.Webview.PLAY_SOUND, (audioName: string, ref: string) => {
      native.playSoundFrontend(-1, audioName, ref, true);
    });
  }
);
alt.on("disconnect", () => {
  webview && webview.valid && webview.destroy();
});
