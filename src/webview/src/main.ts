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
  // @ts-expect-error might be typescript bug
  .use(pinia)
  .use(vuetify)
  .directive("click-outside", vClickOutside)
  .directive("horizontal-scroll", vHorizontalScroll);

app.mount("#app");
