import * as alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { Scene } from "@shared/enums/ui";
import { CharacterPed } from "@/core/utility/character-ped";
import { getWebview, setScene } from "@/core/user-interface/webview";
import { setupCharacterCreationScene } from "./setup-scene";
import { cleanupCharacterCreationScene } from "./cleanup-scene";

alt.Events.onServer(ClientEvents.FromServer.START_CHARACTER_CREATION_SCENE, async () => {
  await setupCharacterCreationScene();

  setScene(Scene.CREATE_CHARACTER, { hasCursor: true });

  game.doScreenFadeIn(1000);
  game.disableScreenblurFade();

  getWebview().on(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, CharacterPed.apply);
});

alt.Events.onServer(ClientEvents.FromServer.END_CHARACTER_CREATION_SCENE, exitCharacterCreation);
alt.Events.onServer(ClientEvents.FromServer.START_GAME, exitCharacterCreation);

function exitCharacterCreation() {
  cleanupCharacterCreationScene();

  // alt.Events.emit(Events.Client.START_CHARACTER_SELECTION_SCENE);
  startGame();
}

function startGame() {
  game.disableScreenblurFade();
  game.doScreenFadeIn(1000);
  game.freezeEntityPosition(alt.Player.local, false);

  setScene(Scene.IN_GAME, { hasCursor: false });

  alt.Events.emit("gameStart");
}
