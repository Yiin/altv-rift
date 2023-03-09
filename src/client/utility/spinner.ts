import alt from "alt-client";
import native from "natives";
import { ISpinner } from "@shared/interfaces/ISpinner";
import { Events } from "@shared/constants/events";

let timeout: number | undefined;

export const Spinner = {
  /**
   * Create a spinner to show in the bottom-right corner.
   */
  create(data: ISpinner) {
    Spinner.clear();

    if (!data.type) {
      data.type = 0;
    }

    native.beginTextCommandBusyspinnerOn("STRING");
    native.addTextComponentSubstringPlayerName(data.text);
    native.endTextCommandBusyspinnerOn(data.type);

    if (data.duration >= 0) {
      timeout = alt.setTimeout(Spinner.clear, data.duration);
    }
  },

  /**
   * Used to clear the last set spinner.
   */
  clear() {
    if (timeout) {
      alt.clearTimeout(timeout);
      timeout = undefined;
    }

    native.busyspinnerOff();
  },
};

alt.onServer(Events.Client.PLAYER_EMIT_SPINNER, Spinner.create);
alt.onServer(Events.Client.PLAYER_EMIT_SPINNER_CLEAR, Spinner.clear);
