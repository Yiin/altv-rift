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
import "./core/builder";
import "./core/store/computed-stream-synced-meta";
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
import "./modules/production";
import "./modules/jobs";
import "./scenes";

import alt from "@altv/client";
import _ from "lodash";
import { useUser } from "./core/store/user.store";
import { useCharacter } from "./core/store/character.store";
import { gameState } from "./core/store/game-state.store";
import { clientState } from "./core/store/client.store";

// game.getNumVehicleMods(alt.hash("ignus"), 0);
// game.getNumVehicleWindowTints();
// game.getNumberOfVehicleColours(alt.hash("ignus"));
// game.getNumberOfVehicleDoors(alt.hash("ignus"));
// game.getNumberOfVehicleNumberPlates();

// game.setVehicleModKit()

alt.Events.onConsoleCommand(({ command }) => {
  if (command === "user") {
    alt.log(JSON.stringify(useUser()?.$state), null, 2);
  } else if (command === "character") {
    alt.log(JSON.stringify(useCharacter()?.$state), null, 2);
  } else if (command === "gamestate") {
    alt.log(JSON.stringify(gameState.$state), null, 2);
  } else if (command === "client") {
    alt.log(JSON.stringify(clientState.$state), null, 2);
  } else if (command === "dump:weapon-stats") {
    _.chunk(
      alt.WeaponData.all.map((x) => ({
        [x.nameHash]: {
          recoilShakeAmplitude: x.recoilShakeAmplitude,
          recoilAccuracyMax: x.recoilAccuracyMax,
          recoilAccuracyToAllowHeadshotPlayer: x.recoilAccuracyToAllowHeadshotPlayer,
          recoilRecoveryRate: x.recoilRecoveryRate,
          animReloadRate: x.animReloadRate,
          vehicleReloadTime: x.vehicleReloadTime,
          lockOnRange: x.lockOnRange,
          accuracySpread: x.accuracySpread,
          range: x.range,
          damage: x.damage,
          clipSize: x.clipSize,
          timeBetweenShots: x.timeBetweenShots,
          headshotDamageModifier: x.headshotDamageModifier,
          playerDamageModifier: x.playerDamageModifier,
        },
      })),
      10,
    ).map((x) =>
      alt.Events.emitServerRaw(
        "dump:weapon-stats",
        x.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      ),
    );
  }
});
