import { createCharacterRoute } from "./create-character";
import { discordAuthRoute } from "./discord-auth";
import { inGameRoute } from "./in-game";

export const routes = [discordAuthRoute, createCharacterRoute, inGameRoute];
