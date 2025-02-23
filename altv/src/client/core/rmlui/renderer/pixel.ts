import alt from "@altv/client";
import { document } from "./element-renderer";

let adjustedFontSize = 16;

function adjustUIBaseFontSize(newResolution?: alt.Vector2) {
  const { x: width, y: height } = newResolution ?? alt.getScreenResolution();
  const targetAspectRatio = 16 / 9;
  const currentAspectRatio = width / height;
  const aspectRatioDeviation = currentAspectRatio / targetAspectRatio;

  // Base font size should be 16px on 1080p screens
  const baseFontSize = Math.max(10, (16 / 1080) * height);
  adjustedFontSize = baseFontSize * Math.min(1, aspectRatioDeviation);

  document.body.style["font-size"] = `${adjustedFontSize.toFixed(6)}px`;
  console.log(`Adjusted base font size to ${adjustedFontSize.toFixed(6)}px`);
}

adjustUIBaseFontSize();

alt.Events.onWindowResolutionChange(({ newResolution }) => {
  adjustUIBaseFontSize(newResolution);
});

export function rem(value: number): string {
  return `${value / 16}rem`;
}

export function px(value: number): number {
  return +(value * (adjustedFontSize / 16)).toFixed(6);
}
