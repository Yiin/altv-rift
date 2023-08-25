import alt from "alt-client";
import game from "natives";
import { ServerEvents } from "@shared/events/server";
import { everyTick } from "@/utility/event-helpers";
import { waitForUserInterface } from "@/utility/user-interface";

alt.on("connectionComplete", handleConnectionComplete);
alt.setWatermarkPosition(4);

async function handleConnectionComplete() {
  game.destroyAllCams(true);
  game.renderScriptCams(false, false, 0, false, false, 0);
  game.freezeEntityPosition(alt.Player.local.scriptID, true);
  game.doScreenFadeOut(0);
  game.triggerScreenblurFadeIn(0);

  alt.setConfigFlag("DISABLE_IDLE_CAMERA", true);
  alt.setConfigFlag("DISABLE_PED_PROP_KNOCK_OFF", true);
  alt.setConfigFlag("DISABLE_AUTO_WEAPON_SWAP", true);

  await waitForUserInterface();

  alt.loadDefaultIpls();

  alt.log("Connection Complete");
  // Calls the login functionality
  alt.emitServer(ServerEvents.FromClient.BEGIN_CONNECTION);
  handleTick();
}

function handleTick() {
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
  game.setPedCanSwitchWeapon(alt.Player.local.scriptID, false);
  alt.setConfigFlag("DISABLE_AUTO_WEAPON_SWAP", true);
}

everyTick(() => {
  game.hideHudComponentThisFrame(6); // Vehicle Name
  if (alt.Player.local.vehicle) {
    game.hideHudComponentThisFrame(7); // Area Name
  }
  game.hideHudComponentThisFrame(8); // Vehicle Class
  game.hideHudComponentThisFrame(9); // Street Name
});
