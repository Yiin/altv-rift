import { RPC } from "@shared/constants/rpcs";
import { IErrorScreen } from "@shared/interfaces/IErrorScreen";
import alt from "alt-client";
import rpc from "altv-rpc";
import native from "natives";

let interval: number | undefined;
let timeout: number | undefined;

const ErrorScreen = {
  /**
   * Create an error screen that takes up the whole screen.
   */
  create(screen: IErrorScreen) {
    ErrorScreen.clear();

    alt.addGxtText("warning_error", screen.title);
    alt.addGxtText("warning_text", screen.text);

    if (screen.text2) {
      alt.addGxtText("warning_text2", screen.text2);
    }

    interval = alt.setInterval(() => {
      if (alt.isConsoleOpen()) {
        return;
      }

      native.setWarningMessageWithHeader(
        "warning_error",
        "warning_text",
        0,
        "warning_text2",
        false,
        -1,
        0,
        0,
        true,
        0
      );
    }, 0);

    if (screen.duration >= 0) {
      alt.setTimeout(ErrorScreen.clear, screen.duration);
    }
  },

  /**
   * Clear the currently drawn error screen.
   */
  clear() {
    if (timeout) {
      alt.clearTimeout(timeout);
      timeout = undefined;
    }

    if (interval) {
      alt.clearInterval(interval);
      interval = undefined;
    }
  },
};

export default ErrorScreen;

rpc.on(RPC.Client.PLAYER_EMIT_ERROR_SCREEN, ErrorScreen.create);
rpc.on(RPC.Client.PLAYER_EMIT_ERROR_SCREEN_CLEAR, ErrorScreen.clear);
