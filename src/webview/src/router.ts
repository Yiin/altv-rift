import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./scenes";

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    transition?: string;
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to, from) => {
  const toDepth = to.path.split("/").length;
  const fromDepth = from.path.split("/").length;
  to.meta.transition =
    toDepth < fromDepth ? "scroll-x-transition" : "scroll-x-reverse-transition";
});
