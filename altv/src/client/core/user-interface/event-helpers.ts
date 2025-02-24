import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { isWindowOpen, useWebview } from "./webview";

export enum GameControlReason {
  UI_WINDOW = "UI Window",
  CHAT = "Chat",
  QA = "QA",
  CHARACTER_CREATOR = "Character Creator",
  CONVERSATION = "Conversation",
}

export enum ScreenBlurReason {
  UI_WINDOW = "UI Window",
  JOINED_SERVER = "Joined server",
}

const focusedInputs = new Set<string>();
const activeBlurs = new Set<ScreenBlurReason>();
const disabledGameControls = new Set<GameControlReason>();
const registeredKeyDownKeys = new Set<alt.Enums.KeyCode>();

export function isTyping() {
  return focusedInputs.size > 0;
}

export function disableGameControls(reason: GameControlReason) {
  disabledGameControls.add(reason);
  alt.setGameControlsActive(false);
}

export function enableGameControls(reason: GameControlReason) {
  disabledGameControls.delete(reason);
  if (!disabledGameControls.size) {
    alt.setGameControlsActive(true);
  }
}

export function areGameControlsActive() {
  return disabledGameControls.size === 0;
}

export function blurScreen(reason: ScreenBlurReason) {
  activeBlurs.add(reason);
  game.triggerScreenblurFadeIn(0);
}

export function unblurScreen(reason: ScreenBlurReason) {
  activeBlurs.delete(reason);
  if (!activeBlurs.size) {
    game.disableScreenblurFade();
  }
}

export function intervalWhile(condition: () => boolean, callback: () => void, intervalTime = 0) {
  const interval = alt.Timers.setInterval(() => {
    if (!condition()) {
      interval?.destroy();
      return;
    }

    callback();
  }, intervalTime);
}

export function everyTickWhile(
  condition: () => boolean,
  callback: () => void,
  onEnd?: () => void,
  options: { skipFirstCheck?: boolean } = {},
) {
  const tick = alt.Timers.everyTick(() => {
    if (!options.skipFirstCheck && !condition()) {
      tick.destroy();
      onEnd?.();
      return;
    }
    options.skipFirstCheck = false;

    callback();
  });

  return tick;
}

type OnKeyDownOptions = {
  isWindowKeybind?: boolean;
};

export function onKeyDown<T extends alt.Enums.KeyCode>(
  key: T,
  callback: (key: T) => void,
  options: OnKeyDownOptions = {},
) {
  if (registeredKeyDownKeys?.has(key)) {
    throw new Error(`KeyDown ${key} is already registered.`);
  }
  registeredKeyDownKeys?.add(key);

  const handler = alt.Events.onKeyDown(({ key: keyPressed }) => {
    if (isTyping()) {
      return;
    }
    if (alt.isConsoleOpen()) {
      return;
    }
    if (!options.isWindowKeybind && isWindowOpen()) {
      return;
    }

    if (keyPressed === key) {
      callback(key);
    }
  });

  return {
    ...handler,
    destroy() {
      registeredKeyDownKeys?.delete(key);
      handler.destroy();
    },
  };
}

export function onKeyUp<T extends alt.Enums.KeyCode>(key: T, callback: (key: T) => void) {
  const handler = alt.Events.onKeyUp(({ key: keyPressed }) => {
    if (focusedInputs.size > 0) {
      return;
    }
    if (alt.isConsoleOpen()) {
      return;
    }
    if (keyPressed === key) {
      callback(key);
    }
  });

  return {
    ...handler,
    destroy() {
      handler.destroy();
    },
  };
}

alt.Events.on("qa-tools:codeEditor", (isFocused: boolean) => {
  if (isFocused) {
    focusedInputs.add("qa-tools:codeEditor");
  } else {
    focusedInputs.delete("qa-tools:codeEditor");
  }
});

alt.Events.on("vchat:focus", (isFocused: boolean) => {
  if (isFocused) {
    focusedInputs.add("vchat:focus");
  } else {
    focusedInputs.delete("vchat:focus");
  }
});

// This is a workaround for cyclic dependency between webview and event-helpers
alt.Timers.nextTick(() => {
  useWebview((webview) => {
    webview.on(ClientEvents.FromWebview.INPUT_FOCUS, (isFocused) => {
      if (isFocused) {
        focusedInputs.add("webview:input");
      } else {
        focusedInputs.delete("webview:input");
      }
    });
  });
});
