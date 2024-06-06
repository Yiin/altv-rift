import { clothesRoute } from "./clothes";
import { createCharacterRoute } from "./create-character";
import { discordAuthRoute } from "./discord-auth";
import { inGameRoute } from "./in-game";
import { weaponModulesRoute } from "./weapon-modules";
import { weaponShopRoute } from "./weapon-shop";
import Empty from "./Empty.vue";

export const routes = [
  { path: "/", component: Empty },
  discordAuthRoute,
  createCharacterRoute,
  inGameRoute,
  weaponShopRoute,
  clothesRoute,
  weaponModulesRoute,
];
