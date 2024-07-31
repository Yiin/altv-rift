import { createCharacterRoute } from "./create-character";
import { discordAuthRoute } from "./discord-auth";
import { inGameRoute } from "./in-game";
import Empty from "./Empty.vue";

export const routes = [
  { path: "/", component: Empty },
  discordAuthRoute,
  createCharacterRoute,
  inGameRoute,
];
