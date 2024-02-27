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
import "./modules/dev";

import alt from "@altv/server";
import { registerCmd } from "./modules/chat";

registerCmd("v", (player) => {
  alt.Vehicle.create({
    model: "adder",
    pos: player.pos.add(2, 0, 0),
  });
});
