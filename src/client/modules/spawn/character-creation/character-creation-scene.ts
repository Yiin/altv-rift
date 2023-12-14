import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { Scene } from "@shared/enums/ui";
import { getWebview, setScene } from "@/core/user-interface/webview";
import { createCharacterPed, updateAppearance } from "./character-ped";
import { whileCreatingCharacter } from "@/core/game-state-hooks/creating-character.state";
import { createCharacterCreationCamera, destroyCharacterCreationCamera } from "./camera";
import { PedAppearance } from "@/core/utility/ped-appearance";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { switchToMultiSecondpart } from "@/core/utility/switch";
import { SWITCHOUT_TYPES } from "@shared/modules/game/ui/switch-out-types";

const pedPosition = new alt.Vector3(1507.9, -1732.3, 78.65);
const pedRotation = 288;

whileCreatingCharacter(async () => {
  const ped = await createCharacterPed(true, pedPosition, pedRotation);

  game.setEntityVisible(ped, false, false);

  PedAppearance.applyEquipment(ped.scriptID);

  await createCharacterCreationCamera(ped);
  game.setEntityVisible(ped, true, false);

  setScene(Scene.CREATE_CHARACTER, { hasCursor: true });

  alt.log("Character Creation Scene Started");

  game.doScreenFadeIn(1000);
  game.disableScreenblurFade();

  getWebview().on(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, updateAppearance);

  return () => {
    getWebview().off(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, updateAppearance);
    destroyCharacterCreationCamera();

    if (ped && ped.valid) {
      ped.destroy();
    }
  };
});

whileInGame(async () => {
  alt.log("Starting game");
  switchToMultiSecondpart(1000, SWITCHOUT_TYPES.ONE_STEP);
  await alt.Utils.wait(500);
  game.disableScreenblurFade();
  game.doScreenFadeIn(1000);
  game.freezeEntityPosition(alt.Player.local, false);

  setScene(Scene.IN_GAME, { hasCursor: false });
});
