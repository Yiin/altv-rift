import alt from "alt-client";
import native from "natives";
import { bind } from "@shared/decorators";
import { RPC } from "@shared/constants/rpcs";
import { SCENE } from "@shared/enums/ui";
import { ClientEvents } from "@shared/events/client";
import { ServerEvents } from "@shared/events/server";
import { CharacterPed } from "@/utility/characterPed";
import { sleep } from "@/utility/sleep";
import { Character } from "@/utility/character";
import { onServer } from "@/decorators/on-server";
import { getGroundPos } from "@/utility/getGroundPos";
import { webviewRpc } from "@/decorators";
import { rpc } from "@/rpc";
import { getWebview, setScene, showCursor } from "@/utility/user-interface";
import { CharacterCreationCamera } from "./camera";

@bind()
export default class CharacterCreationScene {
  private pedPosition = new alt.Vector3(1507.9, -1732.3, 78.65);
  private pedRotation = 288;

  @onServer(ClientEvents.FromServer.START_CHARACTER_CREATION_SCENE)
  async start() {
    alt.showCursor(true);

    await sleep(1000);
    const pedPosition = await getGroundPos(this.pedPosition);

    await CharacterPed.create(true, pedPosition, this.pedRotation);
    await sleep(200);
    await CharacterPed.setHidden(true);
    await CharacterCreationCamera.create(CharacterPed.get());

    await Character.applyEquipment(CharacterPed.get());
    await CharacterPed.setHidden(false);

    setScene(SCENE.CREATE_CHARACTER);

    native.doScreenFadeIn(1000);
    native.disableScreenblurFade();

    getWebview().on(
      ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE,
      CharacterPed.apply
    );
  }

  @webviewRpc(RPC.Client.CREATE_CHARACTER)
  async createCharacter(data: { name: string; appearance: any }) {
    const characterId = await rpc.callServer(RPC.Server.CREATE_CHARACTER, data);

    await alt.emitServer(ServerEvents.FromClient.START_GAME, characterId);

    this.end();
  }

  @onServer(ClientEvents.FromServer.END_CHARACTER_CREATION_SCENE)
  @onServer(ClientEvents.FromServer.START_GAME)
  end() {
    native.disableScreenblurFade();
    showCursor(false);
    setScene(SCENE.IN_GAME);
    CharacterCreationCamera.destroy();
    CharacterPed.destroy();
    native.doScreenFadeIn(1000);
    native.freezeEntityPosition(alt.Player.local.scriptID, false);

    // alt.emit(Events.Client.START_CHARACTER_SELECTION_SCENE);
  }
}
