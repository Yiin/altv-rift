import alt from "alt-client";
import native from "natives";
import { Events } from "@shared/constants/events";

let timeoutId: number | undefined;

/**
 * Draw mission text on the bottom of screen
 */
export function drawMissionText(text: string, duration?: number) {
  if (timeoutId) {
    alt.setWatermarkPosition(0);
    alt.clearTimeout(timeoutId);
  }

  native.clearPrints();
  native.beginTextCommandPrint("STRING");
  native.addTextComponentSubstringPlayerName(text);
  if (typeof duration !== "number") {
    duration = text.length * 100;
  }

  native.endTextCommandPrint(duration, true);
  timeoutId = alt.setTimeout(() => {
    alt.setWatermarkPosition(4);
    timeoutId = undefined;
  }, duration);
}

alt.onServer(Events.Client.PLAYER_EMIT_MISSION_TEXT, drawMissionText);
