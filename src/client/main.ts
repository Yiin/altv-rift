declare module "alt-server" {
  interface Player {
    pinia: undefined;
    user: undefined;
    character: undefined;
    gameState: undefined;
  }
}

import "./core/user-interface";
import "./core/rmlui";
import "./modules/world";
import "./modules/auth";
import "./modules/spawn";
import "./modules/chat";
import "./modules/player";
import "./modules/admin";
import "./modules/inventory";
import "./modules/npcs";
import "./modules/questing";
import "./modules/skills";
