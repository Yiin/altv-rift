import alt from "alt-client";

let screenResolution = alt.getScreenResolution();

alt.on("windowResolutionChange", (_, resolution) => {
  screenResolution = resolution;
});

export function getScreenResolution() {
  return screenResolution;
}
