import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { Scene } from "@shared/enums/ui";
import { SWITCHOUT_TYPES } from "@shared/modules/game/ui/switch-out-types";
import { useWebview, setScene } from "@/core/user-interface/webview";
import { whileCreatingCharacter } from "@/core/game-state-hooks/creating-character.state";
import { PedAppearance } from "@/core/utility/ped-appearance";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { switchToMultiSecondpart } from "@/core/utility/switch";
import { createCharacterCreationCamera, destroyCharacterCreationCamera } from "./camera";
import { createCharacterPed, updateAppearance } from "./character-ped";

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

  useWebview().on(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, updateAppearance);

  return () => {
    useWebview().off(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, updateAppearance);
    destroyCharacterCreationCamera();

    if (ped && ped.valid) {
      ped.destroy();
    }
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
