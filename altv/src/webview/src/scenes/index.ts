import { clothesRoute } from "./clothes";
import { createCharacterRoute } from "./create-character";
import { discordAuthRoute } from "./discord-auth";
import { inGameRoute } from "./in-game";
import { weaponModulesRoute } from "./weapon-modules";
import { weaponShopRoute } from "./weapon-shop";

export const routes = [
  { path: '/', component: () => import('./Empty.vue') },
  discordAuthRoute,
  createCharacterRoute,
  inGameRoute,
  weaponShopRoute,
  clothesRoute,
  weaponModulesRoute,
];
