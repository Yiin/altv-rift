import { clothesRoute } from "./clothes";
import { craftingOneRoute } from "./crafting";
import { createCharacterRoute } from "./create-character";
import { discordAuthRoute } from "./discord-auth";
import { inGameRoute } from "./in-game";
import { weaponModulesRoute } from "./weapon-modules";
import { weaponShopRoute } from "./weapon-shop";

export const routes = [discordAuthRoute, createCharacterRoute, inGameRoute, craftingOneRoute, weaponShopRoute, clothesRoute, weaponModulesRoute];
