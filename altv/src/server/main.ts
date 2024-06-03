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
import "./modules/loot";
import "./modules/dev";
import "./modules/admin";
import "./scenes";

import fs from "node:fs";
import path from "node:path";
import alt from "@altv/server";
import { getBlueprint } from "@shared/modules/production";
import { registerCmd } from "./modules/chat";
import { needsToBeInGame } from "./core/utility/assertions";

registerCmd("v", (player) => {
  alt.Vehicle.create({
    model: "ignus",
    pos: player.pos.add(2, 0, 0),
  });
});

registerCmd("b", (player, [blueprint]) => {
  needsToBeInGame(player);

  if (getBlueprint(blueprint)) {
    player.addBlueprint(blueprint as any);
  }
});

alt.Events.onPlayer(
  "dump:weapon-stats",
  (
    player,
    stats: {
      [nameHash: string]: {
        recoilShakeAmplitude: number;
        recoilAccuracyMax: number;
        recoilAccuracyToAllowHeadshotPlayer: number;
        recoilRecoveryRate: number;
        animReloadRate: number;
        vehicleReloadTime: number;
        lockOnRange: number;
        accuracySpread: number;
        range: number;
        damage: number;
        clipSize: number;
        timeBetweenShots: number;
        headshotDamageModifier: number;
        playerDamageModifier: number;
      };
    },
  ) => {

    const weaponStatsJsonFilePath = path.join(
      __dirname,
      "../shared/modules/items/registry/weapons/weapon-stats.json",
    );
    const weaponStats = JSON.parse(fs.readFileSync(weaponStatsJsonFilePath, "utf-8"));

    for (const [nameHash, stat] of Object.entries(stats)) {
      weaponStats[nameHash] = stat;
    }

    fs.writeFileSync(weaponStatsJsonFilePath, JSON.stringify(weaponStats, null, 2));
  },
);

console.log("woah");
