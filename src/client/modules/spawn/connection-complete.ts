import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { ServerEvents } from "@shared/events/server";
import { waitForUserInterface } from "@/core/user-interface/webview";
import { PED_CONFIG_FLAG } from "@/core/constants/ped-flags";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { whileInVehicle } from "@/core/game-state-hooks/in-vehicle.state";

alt.Events.onConnectionComplete(handleConnectionComplete);
alt.setWatermarkPosition(4);

async function handleConnectionComplete() {
  game.destroyAllCams(true);
  game.renderScriptCams(false, false, 0, false, false, 0);
  game.freezeEntityPosition(alt.Player.local, true);
  game.doScreenFadeOut(0);
  game.triggerScreenblurFadeIn(0);

  alt.ConfigFlag.set(alt.Enums.ConfigFlag.DISABLE_IDLE_CAMERA, true);
  alt.ConfigFlag.set(alt.Enums.ConfigFlag.DISABLE_PED_PROP_KNOCK_OFF, true);
  alt.ConfigFlag.set(alt.Enums.ConfigFlag.DISABLE_AUTO_WEAPON_SWAP, true);

  alt.log("Loading User Interface...");

  await waitForUserInterface();

  alt.log("Loading World...");

  alt.Streaming.loadDefaultIpls();

  setupGameSettings();

  alt.log("Connection complete, notifying server...");
  alt.Events.emitServerRaw(ServerEvents.FromClient.BEGIN_CONNECTION);
}

function setupGameSettings() {
  alt.log("Setting up game settings...");

  game.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
  game.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE"); // Used to stop police sound in town
  game.cancelAllPoliceReports(); // Used to stop default police radio around/In police vehicle
  game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL", false); // Turn off prison sound
  game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING", false); // Turn off prison sound
  game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM", false); // Turn off prison sound
  game.setAmbientZoneState("", false, false);
  game.clearAmbientZoneState("AZ_DISTANT_SASQUATCH", false);
  game.setAudioFlag("LoadMPData", true);
  game.setAudioFlag("DisableFlightMusic", true);
  // game.setPedCanSwitchWeapon(alt.Player.local, false);
}

alt.Events.onSpawned(() => {
  game.setPedConfigFlag(alt.Player.local, PED_CONFIG_FLAG.UseHelmet, false);
});

alt.Timers.everyTick(() => {
  game.hideHudComponentThisFrame(6); // Vehicle Name
  if (alt.Player.local.vehicle) {
    game.hideHudComponentThisFrame(7); // Area Name
  }
  game.hideHudComponentThisFrame(8); // Vehicle Class
  game.hideHudComponentThisFrame(9); // Street Name
});
