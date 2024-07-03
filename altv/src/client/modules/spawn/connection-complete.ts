import alt from "@altv/client";
import game from "@altv/natives";
import { ServerEvents } from "@shared/events/server";
import { waitForUserInterface } from "@/core/user-interface/webview";
import { PED_CONFIG_FLAG } from "@/core/constants/ped-flags";
import { ScreenBlurReason, blurScreen } from "@/core/user-interface/event-helpers";
import { Control, ControlType } from "@/core/constants/controls";
import { useCharacter } from "@/core/store/character.store";
import { TopItemInfo, getItemInfoByKey } from "@shared/modules/items";

alt.Events.onConnectionComplete(handleConnectionComplete);
alt.setWatermarkPosition(4);

async function handleConnectionComplete() {
  game.destroyAllCams(true);
  game.renderScriptCams(false, false, 0, false, false, 0);
  game.freezeEntityPosition(alt.Player.local, true);
  game.doScreenFadeOut(0);
  blurScreen(ScreenBlurReason.JOINED_SERVER);

  alt.ConfigFlag.set(alt.Enums.ConfigFlag.DISABLE_IDLE_CAMERA, true);
  alt.ConfigFlag.set(alt.Enums.ConfigFlag.DISABLE_PED_PROP_KNOCK_OFF, true);
  alt.ConfigFlag.set(alt.Enums.ConfigFlag.DISABLE_AUTO_WEAPON_SWAP, true);

  alt.log("Loading User Interface...");

  await waitForUserInterface();

  alt.log("Loading World...");

  alt.Streaming.loadDefaultIpls();

  alt.log("Setting up game settings...");
  setupGameSettings();

  alt.log("Connection complete, notifying server...");
  alt.Events.emitServerRaw(ServerEvents.FromClient.BEGIN_CONNECTION);
}

function setupGameSettings() {
  game.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE"); // Used to stop police sound in town
  game.cancelAllPoliceReports(); // Used to stop default police radio around/In police vehicle
  game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL", false); // Turn off prison sound
  game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING", false); // Turn off prison sound
  game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM", false); // Turn off prison sound

  game.startAudioScene("DLC_MPHEIST_TRANSITION_TO_APT_FADE_IN_RADIO_SCENE") // removes the music
  game.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_01_STAGE", false) // disables the audio from unicorn
  game.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_02_MAIN_ROOM", false) // disables the audio from unicorn
  game.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_03_BACK_ROOM", false) // disables the audio from unicorn
  game.setAmbientZoneListStatePersistent("AZL_DLC_Hei4_Island_Zones", true, true) // cayo ambient
  game.setAmbientZoneListStatePersistent("AZL_DLC_Hei4_Island_Disabled_Zones", false, true)  // cayo ambien
  game.startAudioScene("CHARACTER_CHANGE_IN_SKY_SCENE") // starts the sky scene audio if you use a another audio scene e.g DLC_VW_Casino_General you must stop the CHARACTER_CHANGE_IN_SKY_SCENE audio scene before starting the another scene
  game.setAudioFlag("PoliceScannerDisabled", true) // Disables the police scanner audio functionality
  game.setAudioFlag("DisableFlightMusic", true) // Disables the flight audio functionality
  game.setAudioFlag("LoadMPData", true);

  game.setAmbientZoneState("", false, false);
  game.clearAmbientZoneState("AZ_DISTANT_SASQUATCH", false);
  game.setPedCanSwitchWeapon(alt.Player.local, false);
  game.setPedConfigFlag(alt.Player.local, PED_CONFIG_FLAG.UseHelmet, false);
}

alt.Events.onSpawned(() => {
  setupGameSettings();
});

alt.Timers.everyTick(() => {
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_SELECT_WEAPON, true);
  game.hideHudComponentThisFrame(1); // Wanted Stars
  game.hideHudComponentThisFrame(2); // Weapon Icon
  game.hideHudComponentThisFrame(3); // Cash
  game.hideHudComponentThisFrame(4); // MP Cash
  game.hideHudComponentThisFrame(6); // Vehicle Name
  if (alt.Player.local.vehicle) {
    game.hideHudComponentThisFrame(7); // Area Name
  }
  game.hideHudComponentThisFrame(8); // Vehicle Class
  game.hideHudComponentThisFrame(9); // Street Name
  game.hideHudComponentThisFrame(13); // Cash Change
  game.hideHudComponentThisFrame(19); // Weapon Wheel
  game.hideHudComponentThisFrame(20); // Weapon Wheel Stats
  game.hideHudComponentThisFrame(21); // HUD Components
  game.hideHudComponentThisFrame(22); // HUD Weapons
});


alt.Events.onConsoleCommand(({ command }) => {
  if (command === "torso") {
    const top = useCharacter().equipment.top;

    if (!top) {
      alt.log(`You have no top!`);
      return;
    }

    const eItem = getItemInfoByKey(top.key) as TopItemInfo;

    let eReturnItem: number = -1337;

    const isMale = useCharacter().appearance.sex;

    if (isMale) {
      if (eItem.drawableId == 0 && eItem.textureId <= 15) eReturnItem = 0
      else if (eItem.drawableId == 1 && eItem.textureId <= 15) eReturnItem = 0
      else if (eItem.drawableId == 2 && eItem.textureId <= 15) eReturnItem = 2
      else if (eItem.drawableId == 3 && eItem.textureId <= 15) eReturnItem = 1		// track jackets use 1	
      else if (eItem.drawableId == 4 && eItem.textureId <= 15) eReturnItem = 1		// suit jackets use torso 1
      else if (eItem.drawableId == 5 && eItem.textureId <= 15) eReturnItem = 5
      else if (eItem.drawableId == 6 && eItem.textureId <= 15) eReturnItem = 12
      else if (eItem.drawableId == 7 && eItem.textureId <= 15) eReturnItem = 1		// hoodies use 1
      else if (eItem.drawableId == 8 && eItem.textureId <= 15) eReturnItem = 8
      else if (eItem.drawableId == 9 && eItem.textureId <= 15) eReturnItem = 0
      else if (eItem.drawableId == 1 && eItem.textureId <= 15) eReturnItem = 1		// suit jackets use torso 1	
      else if (eItem.drawableId == 1 && eItem.textureId <= 15) eReturnItem = 11
      else if (eItem.drawableId == 12 && eItem.textureId <= 15) eReturnItem = 12
      else if (eItem.drawableId == 13 && eItem.textureId <= 15) eReturnItem = 11
      else if (eItem.drawableId == 14 && eItem.textureId <= 15) eReturnItem = 4
      else if (eItem.drawableId == 15 && eItem.textureId <= 15) eReturnItem = 15
      else {
        if (eItem.restrictionTags?.includes("DRAW_11")) {
          eReturnItem = 15;
        } else {
          // Look up the forced components for this DLC item.
          // iItemNameHash = GET_NAME_HASH_FROM_PED_COMP_ITEM(eModel, eItem, COMP_TYPE_JBIB, 3)
          const iItemNameHash = alt.hash(eItem.key);
          if (iItemNameHash != -1) {
            const iForcedComps = game.getShopPedApparelForcedComponentCount(iItemNameHash);
            alt.log(`Forced components: ${iForcedComps}`);
            for (let iForcedComp = 0; iForcedComp < iForcedComps; ++iForcedComp) {
              const [iRetNameHash, iRetCompEnum, iRetType] = game.getForcedComponent(iItemNameHash, iForcedComp);
              if (iRetType == 3 /* PED_COMP_TORSO */) {
                // Forced DLC item
                if (iRetNameHash != 0 && iRetNameHash != 1849449579 /* 1849449579 = "0" */) {
                  // eReturnItem = GET_PED_COMP_ITEM_FROM_NAME_HASH(eModel, iRetNameHash, COMP_TYPE_TORSO, 3);
                  eReturnItem = iRetNameHash;
                  alt.log("name hash");
                  // Forced on-disk item
                } else {
                  eReturnItem = iRetCompEnum;
                  alt.log("ret enum?");
                }
                break;
              }
            }
          }
        }
      }
    } else {
      if (eItem.drawableId === 0) eReturnItem = 0;
      else if (eItem.drawableId == 1 && eItem.textureId <= 15) eReturnItem = 5;
      else if (eItem.drawableId == 2 && eItem.textureId <= 15) eReturnItem = 2;
      else if (eItem.drawableId == 3 && eItem.textureId <= 15) eReturnItem = 3;
      else if (eItem.drawableId == 4 && eItem.textureId <= 15) eReturnItem = 4;
      else if (eItem.drawableId == 5 && eItem.textureId <= 15) eReturnItem = 4;
      else if (eItem.drawableId == 6 && eItem.textureId <= 15) eReturnItem = 5;
      else if (eItem.drawableId == 7 && eItem.textureId <= 15) eReturnItem = 6;
      else if (eItem.drawableId == 8 && eItem.textureId <= 15) eReturnItem = 5;
      else if (eItem.drawableId == 9 && eItem.textureId <= 15) eReturnItem = 9;
      else if (eItem.drawableId == 10 && eItem.textureId <= 15) eReturnItem = 7;
      else if (eItem.drawableId == 11 && eItem.textureId <= 15) eReturnItem = 11;
      else if (eItem.drawableId == 12 && eItem.textureId <= 15) eReturnItem = 12;
      else if (eItem.drawableId == 13 && eItem.textureId <= 15) eReturnItem = 4;
      else if (eItem.drawableId == 14 && eItem.textureId <= 15) eReturnItem = 14;
      else if (eItem.drawableId == 15 && eItem.textureId <= 15) eReturnItem = 15;
      else {
        // Look up the forced components for this DLC item.
        // iItemNameHash = GET_NAME_HASH_FROM_PED_COMP_ITEM(eModel, eItem, COMP_TYPE_JBIB, 4)
        const iItemNameHash = alt.hash(eItem.key);
        if (iItemNameHash != -1) {
          const iForcedComps = game.getShopPedApparelForcedComponentCount(iItemNameHash);
          alt.log(`Forced components: ${iForcedComps}`);
          for (let iForcedComp = 0; iForcedComp < iForcedComps; ++iForcedComp) {
            const [iRetNameHash, iRetCompEnum, iRetType] = game.getForcedComponent(iItemNameHash, iForcedComp);
            if (iRetType === 3 /* torso */) {
              // Forced DLC item
              if (iRetNameHash != 0 && iRetNameHash != 1849449579 /* 1849449579 = "0" */) {
                eReturnItem = iRetNameHash;
                // eReturnItem = GET_PED_COMP_ITEM_FROM_NAME_HASH(eModel, iRetNameHash, 3/* COMP_TYPE_TORSO */, 4);
                // Forced on-disk item
              } else {
                eReturnItem = iRetCompEnum
                break;
              }
            }
          }
        }
      }
    }

    alt.log(`Found torso? ${eReturnItem}`);
  }

  if (command === "torso2") {
    const top = useCharacter().equipment.top;

    if (!top) {
      alt.log(`You have no top!`);
      return;
    }

    const { drawableId, textureId } = getItemInfoByKey(top.key);

    const ped = alt.Player.local;

    const topHash = game.getHashNameForComponent(ped, 11, drawableId, textureId);

    let fcTorsoDrawable = -1, fcTorsoTexture = -1;

    console.log(topHash, 11, drawableId, textureId);

    for (let i = 0; i < game.getShopPedApparelForcedComponentCount(topHash); i++) {
      let [fcNameHash, fcEnumValue, fcType] = game.getForcedComponent(topHash, i);

      console.log({ fcNameHash, fcEnumValue, fcType });

      if (fcType == 3) {
        if (fcNameHash == 0 || fcNameHash == alt.hash("0")) {
          fcTorsoDrawable = fcEnumValue;
          fcTorsoTexture = 0;
        }
        else {
          const torsoData = game.getShopPedComponent(fcNameHash);

          console.log({ torsoData });

          fcTorsoDrawable = torsoData.drawable;
          fcTorsoTexture = torsoData.texture;
        }
      } else {
        console.log('fc:', fcType, 'dcEnumValue', fcEnumValue, 'torsoData', game.getShopPedComponent(fcNameHash));
      }
    }

    console.log("Current top: " + drawableId + " - " + textureId);
    console.log("Proper torso drawable: " + fcTorsoDrawable);
    console.log("Proper torso texture: " + fcTorsoTexture);

    if (fcTorsoDrawable !== -1 || fcTorsoTexture !== -1) {
      game.setPedComponentVariation(ped, 3, fcTorsoDrawable, fcTorsoTexture, 2);
    }

    return;// [fcTorsoDrawable, fcTorsoTexture];
  }
});
