import alt from "alt-client";
import native from "natives";
import { Bones } from "@shared/enums/bones";
import { Events } from "@shared/constants/events";
import { loadSceneAtCoords } from "@/utility/scene";
import { CharacterPed } from "@/utility/characterPed";
import { Control, ControlType } from "@/constants/controls";
import { everyTickWhile } from "@/utility/event-helpers";
import { getWebview } from "@/utility/user-interface";

const cameraPositionBaseline = new alt.Vector3(1508.8, -1731.9, 79.3);
let cameraHorizontalOffset = 0;
let cameraVerticalOffset = 0;
let zoom = 1;
let camera: number | undefined;
let pedPosition: alt.Vector3;
let cameraControlInterval: number | undefined;

export const CharacterCreationCamera = {
  async create(scriptID: number) {
    pedPosition = native.getEntityCoords(scriptID, false);

    // Set Focus in the Area
    native.requestCollisionAtCoord(pedPosition.x, pedPosition.y, pedPosition.z);
    native.setFocusPosAndVel(
      pedPosition.x,
      pedPosition.y,
      pedPosition.z,
      0,
      0,
      0
    );
    // await loadSceneAtCoords(pedPosition);

    const fov = 60;
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

    alt.log(`Camera: ${camera}`);

    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);

    CharacterCreationCamera.updateCamera();

    const front = native.getOffsetFromEntityInWorldCoords(scriptID, 0, 1.5, 0);
    const back = native.getOffsetFromEntityInWorldCoords(scriptID, 0, -1.5, 0);

    everyTickWhile(
      () => camera !== undefined,
      () => {
        native.drawLightWithRange(
          front.x,
          front.y,
          front.z,
          255,
          234,
          207,
          5,
          2
        );
        native.drawLightWithRange(back.x, back.y, back.z, 255, 234, 207, 5, 2);
      }
    );

    everyTickWhile(
      () => camera !== undefined,
      () => {
        if (
          native.isControlJustPressed(
            ControlType.PLAYER_CONTROL,
            Control.INPUT_WEAPON_WHEEL_PREV
          )
        ) {
          zoom = Math.max(0.35, zoom - 0.05);
        }
        if (
          native.isControlJustPressed(
            ControlType.PLAYER_CONTROL,
            Control.INPUT_WEAPON_WHEEL_NEXT
          )
        ) {
          zoom = Math.min(1.5, zoom + 0.05);
        }
        CharacterCreationCamera.updateCamera();
      }
    );

    getWebview().on(Events.Webview.CAMERA_MOVE_START, () => {
      alt.log("Camera Move Start");
      if (cameraControlInterval) {
        alt.clearEveryTick(cameraControlInterval);
        cameraControlInterval = undefined;
      }
      cameraControlInterval = alt.everyTick(this.updateCameraMove);
    });

    getWebview().on(Events.Webview.CAMERA_MOVE_END, () => {
      if (cameraControlInterval) {
        alt.log("Camera Move End");
        alt.clearEveryTick(cameraControlInterval);
        cameraControlInterval = undefined;
      }
    });
  },

  async updateCameraMove() {
    if (!camera) {
      return;
    }

    const inputs = {
      InputLookUp: [
        native.isControlPressed(
          ControlType.PLAYER_CONTROL,
          Control.INPUT_LOOK_UP_ONLY
        ),
        Math.abs(
          native.getControlValue(
            ControlType.PLAYER_CONTROL,
            Control.INPUT_LOOK_UP_ONLY
          ) - 127
        ),
      ],
      InputLookDown: [
        native.isControlPressed(
          ControlType.PLAYER_CONTROL,
          Control.INPUT_LOOK_DOWN_ONLY
        ),
        Math.abs(
          native.getControlValue(
            ControlType.PLAYER_CONTROL,
            Control.INPUT_LOOK_DOWN_ONLY
          ) - 127
        ),
      ],
      InputLookLeft: [
        native.isControlPressed(
          ControlType.PLAYER_CONTROL,
          Control.INPUT_LOOK_LEFT_ONLY
        ),
        Math.abs(
          native.getControlValue(
            ControlType.PLAYER_CONTROL,
            Control.INPUT_LOOK_LEFT_ONLY
          ) - 127
        ),
      ],
      InputLookRight: [
        native.isControlPressed(
          ControlType.PLAYER_CONTROL,
          Control.INPUT_LOOK_RIGHT_ONLY
        ),
        Math.abs(
          native.getControlValue(
            ControlType.PLAYER_CONTROL,
            Control.INPUT_LOOK_RIGHT_ONLY
          ) - 127
        ),
      ],
    } as const;

    const slowdown = 500;

    cameraHorizontalOffset +=
      inputs.InputLookLeft[1] /
        (slowdown * (inputs.InputLookLeft[0] ? 10 : 1)) -
      inputs.InputLookRight[1] /
        (slowdown * (inputs.InputLookRight[0] ? 10 : 1));
    cameraVerticalOffset -=
      inputs.InputLookUp[1] / (slowdown * (inputs.InputLookUp[0] ? 10 : 1)) -
      inputs.InputLookDown[1] / (slowdown * (inputs.InputLookDown[0] ? 10 : 1));

    cameraVerticalOffset = Math.max(-0.6, Math.min(0.8, cameraVerticalOffset));
  },

  async updateCamera() {
    if (!camera) {
      return;
    }

    const x1 = pedPosition.x + Math.cos(cameraHorizontalOffset) * zoom;
    const y1 = pedPosition.y + Math.sin(cameraHorizontalOffset) * zoom;
    const z = cameraPositionBaseline.z + Math.tan(cameraVerticalOffset);

    native.setCamCoord(camera, x1, y1, z);
    native.pointCamAtPedBone(
      camera,
      CharacterPed.get(),
      Bones.SKEL_Head,
      0, // -Math.cos(cameraHorizontalOffset) / 3,
      0, // -Math.sin(cameraHorizontalOffset) / 3,
      0.1,
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

    cameraHorizontalOffset = 0;
    cameraVerticalOffset = 0;
    camera = undefined;
  },
};
