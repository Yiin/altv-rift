import alt from "alt-client";
import native from "natives";
import { ServerEvents } from "@shared/events/server";
import { everyTick } from "@/utility/event-helpers";
import { waitForUserInterface } from "@/utility/user-interface";

alt.on("connectionComplete", handleConnectionComplete);
alt.setWatermarkPosition(4);

async function handleConnectionComplete() {
  native.destroyAllCams(true);
  native.renderScriptCams(false, false, 0, false, false, 0);
  native.freezeEntityPosition(alt.Player.local.scriptID, true);
  native.doScreenFadeOut(0);
  native.triggerScreenblurFadeIn(0);

  alt.setConfigFlag("DISABLE_IDLE_CAMERA", true);
  alt.setConfigFlag("DISABLE_PED_PROP_KNOCK_OFF", true);
  alt.setConfigFlag("DISABLE_AUTO_WEAPON_SWAP", true);

  await waitForUserInterface();

  alt.log("Connection Complete");
  // Calls the login functionality
  alt.emitServer(ServerEvents.FromClient.BEGIN_CONNECTION);
  handleTick();
}

function handleTick() {
  native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
  native.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE"); // Used to stop police sound in town
  native.cancelAllPoliceReports(); // Used to stop default police radio around/In police vehicle
  native.clearAmbientZoneState(
    "AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL",
    false
  ); // Turn off prison sound
  native.clearAmbientZoneState(
    "AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING",
    false
  ); // Turn off prison sound
  native.clearAmbientZoneState(
    "AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM",
    false
  ); // Turn off prison sound
  native.setAmbientZoneState("", false, false);
  native.clearAmbientZoneState("AZ_DISTANT_SASQUATCH", false);
  native.setAudioFlag("LoadMPData", true);
  native.setAudioFlag("DisableFlightMusic", true);
  native.setPedCanSwitchWeapon(alt.Player.local.scriptID, false);
}

everyTick(() => {
  native.hideHudComponentThisFrame(6); // Vehicle Name
  if (alt.Player.local.vehicle) {
    native.hideHudComponentThisFrame(7); // Area Name
  }
  native.hideHudComponentThisFrame(8); // Vehicle Class
  native.hideHudComponentThisFrame(9); // Street Name
});
