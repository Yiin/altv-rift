declare module "@altv/server" {
  interface Player {
    pinia: undefined;
    user: undefined;
    character: undefined;
    gameState: undefined;
  }
}

import "./core/user-interface";
import "./core/rmlui";
import "./core/remote-native";
import "./modules/dev";
import "./modules/world";
import "./modules/auth";
import "./modules/spawn";
import "./modules/chat";
import "./modules/player";
import "./modules/admin";
import "./modules/inventory";
import "./modules/peds";
import "./modules/questing";
import "./modules/skills";

import * as alt from "@altv/client";
import { useUser } from "./core/store/user.store";
import { useCharacter } from "./core/store/character.store";
import { gameState } from "./core/store/game-state.store";
import { clientState } from "./core/store/client.store";

alt.Events.onConsoleCommand(({ command }) => {
  if (command === "user") {
    alt.log(JSON.stringify(useUser()?.$state), null, 2);
  } else if (command === "character") {
    alt.log(JSON.stringify(useCharacter()?.$state), null, 2);
  } else if (command === "gamestate") {
    alt.log(JSON.stringify(gameState.$state), null, 2);
  } else if (command === "client") {
    alt.log(JSON.stringify(clientState.$state), null, 2);
  }
});
