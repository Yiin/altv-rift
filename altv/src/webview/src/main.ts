import "./setup-altv";
import { createApp } from "vue";
import { ClientEvents } from "@shared/events/client";
import { loadFonts } from "./plugins/webfontloader";
import { vClickOutside } from "./directives/click-outside";
import { vHorizontalScroll } from "./directives/horizontal-scroll";
import { router } from "./router";
import { pinia } from "./store";
import App from "./App.vue";
import "./main.css";

loadFonts();

const app = createApp(App)
  .use(router)
  .use(pinia)
  .directive("click-outside", vClickOutside)
  .directive("horizontal-scroll", vHorizontalScroll);

console.log("Mounting the vue app...");
app.mount("#app");

function adjustUIBaseFontSize() {
  const targetAspectRatio = 16 / 9;
  const currentAspectRatio = window.innerWidth / window.innerHeight;
  const aspectRatioDeviation = currentAspectRatio / targetAspectRatio;

  // Base font size should be 16px on 1080p screens
  const baseFontSize = Math.max(10, (16 / 1080) * window.innerHeight);
  const adjustedFontSize = baseFontSize * Math.min(1, aspectRatioDeviation);

  document.documentElement.style.fontSize = `${adjustedFontSize}px`;
}

adjustUIBaseFontSize();
window.addEventListener("resize", adjustUIBaseFontSize);

window.addEventListener("wheel", (event) => {
  const scrolledUp = event.deltaY < 0 ? -event.deltaY : 0;
  const scrolledDown = event.deltaY > 0 ? event.deltaY : 0;

  if (scrolledUp) {
    alt.emitRaw(ClientEvents.FromWebview.WHEEL_UP, Math.abs(event.deltaY));
  }

  if (scrolledDown) {
    alt.emitRaw(ClientEvents.FromWebview.WHEEL_DOWN, Math.abs(event.deltaY));
  }
});
