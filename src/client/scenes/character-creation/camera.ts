import alt from "alt-client";
import native from "natives";
import { Bones } from "@shared/enums/bones";
import { loadSceneAtCoords } from "@/utility/scene";
import { CharacterPed } from "@/utility/characterPed";

const cameraPositionBaseline = new alt.Vector3(1508.8, -1731.9, 79.3);
let disableCameraMovements = false;
let cameraHorizontalOffset = 0;
let cameraVerticalOffset = 0;
let camera: number | undefined;
let pedPosition: alt.Vector3;
let cameraControlInterval: number | undefined;

export const CharacterCreationCamera = {
  async create(scriptID: number) {
    pedPosition = native.getEntityCoords(scriptID, false);

    // Set Focus in the Area
    native.requestCollisionAtCoord(
      pedPosition.x,
      pedPosition.y,
      pedPosition.z
    );
    native.setFocusPosAndVel(
      pedPosition.x,
      pedPosition.y,
      pedPosition.z,
      0,
      0,
      0
    );
    await loadSceneAtCoords(pedPosition);

    const fov = 90;
    const startCamPosition = cameraPositionBaseline;

    camera = native.createCamWithParams(
      "DEFAULT_SCRIPTED_CAMERA",
      startCamPosition.x,
      startCamPosition.y,
      startCamPosition.z,
      0,
      0,
      0,
      fov,
      true,
      0
    );

    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);

    this.updateCamera(true);

    cameraControlInterval = alt.everyTick(this.updateCamera);
  },
  
  async updateCamera (force = false) {
    if (!camera) {
      return;
    }

    if (disableCameraMovements) {
      return;
    }

    const isAnyCameraKeyDown =
      alt.isKeyDown(alt.KeyCode.Left) ||
      alt.isKeyDown(alt.KeyCode.Right) ||
      alt.isKeyDown(alt.KeyCode.Up) ||
      alt.isKeyDown(alt.KeyCode.Down);

    if (!force && !isAnyCameraKeyDown) {
      return;
    }

    if (alt.isKeyDown(alt.KeyCode.Left)) {
      cameraHorizontalOffset -= 0.02;
    }

    if (alt.isKeyDown(alt.KeyCode.Right)) {
      cameraHorizontalOffset += 0.02;
    }

    if (alt.isKeyDown(alt.KeyCode.Up)) {
      cameraVerticalOffset = Math.max(
        -0.5,
        Math.min(0.5, cameraVerticalOffset + 0.02)
      );
    }

    if (alt.isKeyDown(alt.KeyCode.Down)) {
      cameraVerticalOffset = Math.max(
        -0.5,
        Math.min(0.5, cameraVerticalOffset - 0.02)
      );
    }

    const x = pedPosition.x + Math.cos(cameraHorizontalOffset);
    const y = pedPosition.y + Math.sin(cameraHorizontalOffset);
    const z = cameraPositionBaseline.z + Math.tan(cameraVerticalOffset);

    native.setCamCoord(camera, x, y, z);
    native.pointCamAtPedBone(
      camera,
      CharacterPed.get(),
      Bones.SKEL_Head,
      -Math.cos(cameraHorizontalOffset) / 3,
      -Math.sin(cameraHorizontalOffset) / 3,
      0,
      true
    );
  },

  destroy() {
    if (cameraControlInterval) {
      alt.clearEveryTick(cameraControlInterval);
      cameraControlInterval = undefined;
    }

    native.clearFocus();
    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);

    disableCameraMovements = false;
    cameraHorizontalOffset = 0;
    cameraVerticalOffset = 0;
    camera = undefined;
    cameraControlInterval = undefined;
  },
}