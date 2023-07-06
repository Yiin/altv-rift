import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";
import { SCENE } from "@/constants/ui";
import { CharacterPed } from "@/utility/character-ped";
import { sleep } from "@/utility/sleep";
import { Character } from "@/utility/character";
import { getGroundPos } from "@/utility/get-ground-pos";
import { getWebview, setScene } from "@/utility/user-interface";
import { CharacterCreationCamera } from "./camera";

const pedPosition = new alt.Vector3(1507.9, -1732.3, 78.65);
const pedRotation = 288;

alt.onServer(
  ClientEvents.FromServer.START_CHARACTER_CREATION_SCENE,
  async () => {
    alt.showCursor(true);

    await sleep(1000);
    const groundPosition = await getGroundPos(pedPosition);

    await CharacterPed.create(true, groundPosition, pedRotation);
    await sleep(200);
    await CharacterPed.setHidden(true);
    await CharacterCreationCamera.create(CharacterPed.get());

    await Character.applyEquipment(CharacterPed.get());
    await CharacterPed.setHidden(false);

    setScene(SCENE.CREATE_CHARACTER);

    game.doScreenFadeIn(1000);
    game.disableScreenblurFade();

    getWebview().on(
      ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE,
      CharacterPed.apply
    );
  }
);

alt.onServer(
  ClientEvents.FromServer.END_CHARACTER_CREATION_SCENE,
  exitCharacterCreation
);
alt.onServer(ClientEvents.FromServer.START_GAME, exitCharacterCreation);

function exitCharacterCreation() {
  game.disableScreenblurFade();
  setScene(SCENE.IN_GAME);
  CharacterCreationCamera.destroy();
  CharacterPed.destroy();
  game.doScreenFadeIn(1000);
  game.freezeEntityPosition(alt.Player.local.scriptID, false);

  // alt.emit(Events.Client.START_CHARACTER_SELECTION_SCENE);
}
