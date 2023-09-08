import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";
import { Spinner } from "@shared/modules/game/ui/spinner/spinner";

let timeout: number | undefined;

/**
 * Create a spinner to show in the bottom-right corner.
 */
export function createSpinner(data: Spinner) {
  clearSpinner();

  if (!data.type) {
    data.type = 0;
  }

  game.beginTextCommandBusyspinnerOn("STRING");
  game.addTextComponentSubstringPlayerName(data.text);
  game.endTextCommandBusyspinnerOn(data.type);

  if (data.duration >= 0) {
    timeout = alt.setTimeout(clearSpinner, data.duration);
  }
}

/**
 * Used to clear the last set spinner.
 */
export function clearSpinner() {
  if (timeout) {
    alt.clearTimeout(timeout);
    timeout = undefined;
  }

  game.busyspinnerOff();
}

alt.onServer(ClientEvents.FromServer.PLAYER_EMIT_SPINNER, createSpinner);
alt.onServer(ClientEvents.FromServer.PLAYER_EMIT_SPINNER_CLEAR, clearSpinner);
