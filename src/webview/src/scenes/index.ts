import { clothesRoute } from "./clothes";
import { craftingRoute } from "./crafting";
import { craftingItemsRoute } from "./crafting-items";
import { createCharacterRoute } from "./create-character";
import { discordAuthRoute } from "./discord-auth";
import { inGameRoute } from "./in-game";
import { weaponModulesRoute } from "./weapon-modules";
import { weaponShopRoute } from "./weapon-shop";

export const routes = [discordAuthRoute, createCharacterRoute, inGameRoute, craftingRoute, weaponShopRoute, clothesRoute, weaponModulesRoute, craftingItemsRoute];
