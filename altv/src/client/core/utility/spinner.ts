import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { Spinner } from "@shared/modules/game/ui/spinner/spinner";

let timeout: alt.Timers.Timeout | undefined;

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
    timeout = alt.Timers.setTimeout(clearSpinner, data.duration);
  }
}

/**
 * Used to clear the last set spinner.
 */
export function clearSpinner() {
  if (timeout) {
    timeout.destroy();
    timeout = undefined;
  }

  game.busyspinnerOff();
}

alt.Events.onServer(ClientEvents.FromServer.PLAYER_EMIT_SPINNER, createSpinner);
alt.Events.onServer(ClientEvents.FromServer.PLAYER_EMIT_SPINNER_CLEAR, clearSpinner);
