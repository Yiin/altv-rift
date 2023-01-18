import alt from "alt-client";
import native from "natives";
import rpc from "altv-rpc";
import { RPC } from "@shared/constants/rpcs";
import { bind } from "@shared/decorators";
import { onRpc } from "@/decorators";
import { CharacterPed } from "@/utility/characterPed";
import { sleep } from "@/utility/sleep";
import { Character } from "@/utility/character";
import { WebViewController } from "@/utility/webView";
import { CharacterCreationCamera } from "./camera";

@bind()
export default class CharacterCreationScene {
  private pedPosition = new alt.Vector3(1507.9, -1732.3, 78.65);
  private pedRotation = 288;

  @onRpc(RPC.Client.START_CHARACTER_CREATION_SCENE)
  async start() {
    alt.showCursor(true);
    
    const pedPosition = new alt.Vector3(
      this.pedPosition.x,
      this.pedPosition.y,
      native.getGroundZFor3dCoord(
        this.pedPosition.x,
        this.pedPosition.y,
        this.pedPosition.z,
        1000,
        false,
        false
      )[1]
    );

    await CharacterPed.create(true, pedPosition, this.pedRotation);
    await sleep(100);
    await CharacterPed.setHidden(true);
    await CharacterCreationCamera.create(CharacterPed.get());

    await Character.applyEquipment(CharacterPed.get());

    rpc.on(
      RPC.Client.UPDATE_CHARACTER_APPEARANCE,
      CharacterPed.apply
    );
  }

  @onRpc(RPC.Client.END_CHARACTER_CREATION_SCENE)
  end() {
    WebViewController.unfocus();
    WebViewController.showCursor(false);
    CharacterCreationCamera.destroy();
    CharacterPed.destroy();
    native.doScreenFadeOut(100);

    rpc.trigger(RPC.Client.START_CHARACTER_SELECTION_SCENE);
  }
}

