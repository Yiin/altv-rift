// Setup
// import "./core/sentry";
import "./core/setup-globals";
import "./core/database";

// prototypes
import "./prototypes/player";

// // events
import "./events";

// // modules
import "./modules/chat";
import "./modules/discord-auth";
import "./modules/character";
import "./modules/items-manager";
import "./modules/combat";
import "./modules/air-drops";
import "./modules/peds";
import "./modules/questing";
import "./modules/skills";
import "./modules/vehicles";
import "./modules/user-interface";
import "./modules/thugs";
import "./modules/production";
import "./modules/dev";

import alt from "@altv/server";
import { getBlueprint } from "@shared/modules/production";
import { registerCmd } from "./modules/chat";
import { needsToBeInGame } from "./core/utility/assertions";

registerCmd("v", (player) => {
  alt.Vehicle.create({
    model: "adder",
    pos: player.pos.add(2, 0, 0),
  });
});

registerCmd("b", (player, [blueprint]) => {
  needsToBeInGame(player);

  if (getBlueprint(blueprint)) {
    player.addBlueprint(blueprint as any);
  }
});
