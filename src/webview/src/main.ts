import "./setup-altv";
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { router } from "./router";
import { pinia } from "./store";

import "./main.css";
import { DefineComponent } from "vue";

loadFonts();

const app = createApp(App).use(router).use(pinia).use(vuetify);

// Dynamically import and register all components in the @/components/icons folder
// const registerIcons = async () => {
//   const components = import.meta.glob("@/components/Icon/*.vue");

//   for (const path in components) {
//     const componentConfig = (await components[path]()!) as { default: DefineComponent };
//     const componentName = path
//       .split("/")
//       .pop()!
//       .replace(/\.\w+$/, ""); // Get file name without extension

//     app.component(componentName, componentConfig.default);
//   }
// };

// registerIcons().then(() => {
// });
app.mount("#app");
