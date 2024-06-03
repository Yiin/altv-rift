import "./setup-altv";
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { router } from "./router";
import { pinia } from "./store";
import "./main.css";
import { vClickOutside } from "./directives/click-outside";
import { vHorizontalScroll } from "./directives/horizontal-scroll";

loadFonts();

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
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
