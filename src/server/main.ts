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

import fs from "fs";
import alt from "@altv/server";
import { FirearmWeapon, MeleeWeapon, ThrowableWeapon, getWeaponModel } from "@shared/modules/items";
import { registerCmd } from "./modules/chat";

registerCmd("v", (player) => {
  alt.Vehicle.create({
    model: "adder",
    pos: player.pos.add(2, 0, 0),
  });
});

const weapons = [
  ...Object.values(FirearmWeapon),
  ...Object.values(ThrowableWeapon),
  ...Object.values(MeleeWeapon),
];

fs.writeFileSync("weapons.txt", `export const weaponModels = {\n`);
weapons.forEach((weapon) => {
  console.log(weapon);
  const model = getWeaponModel(weapon);

  fs.appendFileSync("weapons.txt", `  "${weapon}": "${model}",\n`);
});

fs.appendFileSync("weapons.txt", `};\n`);
