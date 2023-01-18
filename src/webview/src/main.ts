import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { router } from "./router";
import { pinia } from "./store";

import "./main.css";

loadFonts();

createApp(App).use(router).use(pinia).use(vuetify).mount("#app");
