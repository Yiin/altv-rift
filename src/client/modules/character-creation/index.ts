import alt from "alt-client";
import native from "natives";
import { bind } from "@shared/decorators";
import { Events } from "@shared/constants/events";
import { RPC } from "@shared/constants/rpcs";
import { SCENE } from "@shared/enums/ui";
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

  @onServer(Events.Client.START_CHARACTER_CREATION_SCENE)
  async start() {
    alt.log("starting character creation scene");
    alt.showCursor(true);

    await sleep(1000);
    const pedPosition = await getGroundPos(this.pedPosition);

    alt.log("Creating character ped");
    await CharacterPed.create(true, pedPosition, this.pedRotation);
    await sleep(1000);
    await CharacterPed.setHidden(true);
    alt.log("Creating camera");
    await CharacterCreationCamera.create(CharacterPed.get());

    await Character.applyEquipment(CharacterPed.get());
    await CharacterPed.setHidden(false);

    native.doScreenFadeIn(1000);

    getWebview().on(
      Events.Client.UPDATE_CHARACTER_APPEARANCE,
      CharacterPed.apply
    );

    setScene(SCENE.CREATE_CHARACTER);
  }

  @webviewRpc(RPC.Client.CREATE_CHARACTER)
  async createCharacter(data: { name: string; appearance: any }) {
    try {
      const characterId = await rpc.callServer(
        RPC.Server.CREATE_CHARACTER,
        data
      );
      await alt.emitServer(Events.Server.START_GAME, characterId);
      this.end();
    } catch (e: any) {
      alt.logError(e, e.errors);
    }
  }

  @onServer(Events.Client.END_CHARACTER_CREATION_SCENE)
  @onServer(Events.Client.START_GAME)
  end() {
    showCursor(false);
    setScene(SCENE.IN_GAME);
    CharacterCreationCamera.destroy();
    CharacterPed.destroy();
    native.doScreenFadeIn(1000);

    // alt.emit(Events.Client.START_CHARACTER_SELECTION_SCENE);
  }
}
