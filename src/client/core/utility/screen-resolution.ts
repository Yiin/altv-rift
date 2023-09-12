import * as alt from "@altv/client";

let screenResolution = alt.getScreenResolution();

alt.Events.onWindowResolutionChange(({ newResolution }) => {
  screenResolution = newResolution;
});

export function getScreenResolution() {
  return screenResolution;
}
