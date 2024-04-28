import alt from "@altv/client";
import game from "@altv/natives";
import { Appearance } from "@prisma/client/edge";
import { ClientEvents } from "@shared/events/client";
import { Scene } from "@shared/enums/ui";
import { SWITCHOUT_TYPES } from "@shared/modules/game/ui/switch-out-types";
import { setScene, waitForUserInterface } from "@/core/user-interface/webview";
import { whileCreatingCharacter } from "@/core/game-state-hooks/creating-character.state";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { setPedAppearance, setPedEquipment } from "@/core/utility/ped-appearance";
import { setupPeacefulPed } from "@/modules/peds/setup-ped/setup-peaceful-ped";
import { createCharacterCreationCamera } from "./camera";
import { createPedModel } from "./ped-model";

const PED_MODEL_POSITION = new alt.Vector3(1507.9, -1732.3, 78.65);
const PED_MODEL_HEADING = 288;
const PED_CAMERA_BASELINE = new alt.Vector3(1508.8, -1731.9, 79.3);

whileCreatingCharacter(async () => {
  // Create the character selection peds
  const male = createPedModel(true, PED_MODEL_POSITION, PED_MODEL_HEADING);
  const female = createPedModel(false, PED_MODEL_POSITION.sub(2, 0, 0), PED_MODEL_HEADING);

  await alt.Utils.waitFor(() => male.scriptID !== 0 && female.scriptID !== 0, 1000);
  await alt.Utils.wait(500);

  game.setEntityAlpha(male, 0, false);
  game.setEntityAlpha(female, 0, false);

  resetModelPed(male);
  resetModelPed(female);

  let currentModel = male;

  const cleanupCamera = await createCharacterCreationCamera(
    PED_MODEL_POSITION,
    PED_CAMERA_BASELINE,
  );

  setScene(Scene.CREATE_CHARACTER, { hasCursor: true });

  alt.log("Character Creation Scene Started");

  game.setEntityAlpha(currentModel, 255, false);

  game.doScreenFadeIn(1000);
  game.disableScreenblurFade();

  const webview = await waitForUserInterface();

  async function onUpdateCharacterAppearance(newAppearance: Appearance) {
    const currentSex = currentModel === male ? 1 : 0;

    if (currentSex !== newAppearance.sex) {
      game.setEntityAlpha(currentModel, 0, false);

      currentModel.pos = PED_MODEL_POSITION.sub(2, 0, 0);
      currentModel = currentModel === male ? female : male;
      currentModel.pos = PED_MODEL_POSITION;

      resetModelPed(currentModel);

      game.setEntityAlpha(currentModel, 255, false);
    }

    setPedAppearance(currentModel, newAppearance);
  }

  webview.on(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, onUpdateCharacterAppearance);

  return () => {
    webview.off(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, onUpdateCharacterAppearance);

    cleanupCamera();

    // cleanup model peds
    male.destroy();
    female.destroy();
  };
});

whileInGame(async () => {
  alt.log("Starting game");
  game.freezeEntityPosition(alt.Player.local, true);
  alt.setGameControlsActive(false);

  await alt.Utils.wait(500);
  game.switchToMultiFirstpart(alt.Player.local, 0, SWITCHOUT_TYPES.ONE_STEP);

  await alt.Utils.wait(2000);
  game.disableScreenblurFade();
  game.doScreenFadeIn(1000);

  await alt.Utils.wait(1000);
  game.switchToMultiSecondpart(alt.Player.local);

  game.freezeEntityPosition(alt.Player.local, false);
  alt.setGameControlsActive(true);

  setScene(Scene.IN_GAME, { hasCursor: false });
});

function resetModelPed(ped: alt.LocalPed) {
  ped.rot = new alt.Vector3(0, 0, PED_MODEL_HEADING);

  setPedEquipment(ped, [], ped.model === alt.hash("mp_m_freemode_01"));
  setupPeacefulPed(ped);

  ped.frozen = true;
}
