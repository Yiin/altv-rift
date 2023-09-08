import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";
import { SCENE } from "@/core/constants/ui";
import { CharacterPed } from "@/core/utility/character-ped";
import { getWebview, setScene } from "@/core/user-interface/webview";
import { setupCharacterCreationScene } from "./setup-scene";
import { cleanupCharacterCreationScene } from "./cleanup-scene";

alt.onServer(ClientEvents.FromServer.START_CHARACTER_CREATION_SCENE, async () => {
  alt.showCursor(true);

  await setupCharacterCreationScene();

  setScene(SCENE.CREATE_CHARACTER);

  game.doScreenFadeIn(1000);
  game.disableScreenblurFade();

  getWebview().on(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, CharacterPed.apply);
});

alt.onServer(ClientEvents.FromServer.END_CHARACTER_CREATION_SCENE, exitCharacterCreation);
alt.onServer(ClientEvents.FromServer.START_GAME, exitCharacterCreation);

function exitCharacterCreation() {
  cleanupCharacterCreationScene();

  // alt.emit(Events.Client.START_CHARACTER_SELECTION_SCENE);
  startGame();
}

function startGame() {
  game.disableScreenblurFade();
  game.doScreenFadeIn(1000);
  game.freezeEntityPosition(alt.Player.local, false);

  setScene(SCENE.IN_GAME);

  alt.emitRaw("gameStart");
}
