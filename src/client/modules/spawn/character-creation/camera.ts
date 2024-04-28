import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { loadSceneAtCoords } from "@/core/utility/scene";
import { Control, ControlType } from "@/core/constants/controls";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { waitForUserInterface } from "@/core/user-interface/webview";
import { vec3ToArr } from "@/core/utility/vectors";

let cameraHorizontalOffset = 0;
let cameraVerticalOffset = 0;
let zoom = 1;
let camera: number | undefined;
let cameraControlInterval: alt.Timers.EveryTick | undefined;
let mouseStartPos: alt.Vector2 | undefined;

export async function createCharacterCreationCamera(
  targetPosition: alt.Vector3,
  cameraPositionBaseline: alt.Vector3,
) {
  const fov = 60;
  const startCamPosition = cameraPositionBaseline;

  camera = game.createCamWithParams(
    "DEFAULT_SCRIPTED_CAMERA",
    ...vec3ToArr(startCamPosition),
    ...vec3ToArr(alt.Vector3.zero),
    fov,
    true,
    0,
  );

  game.setCamActive(camera, true);
  game.renderScriptCams(true, false, 0, true, false, 0);

  game.pointCamAtCoord(camera, targetPosition.x, targetPosition.y, targetPosition.z + 0.8);

  // Set Focus in the Area
  game.requestCollisionAtCoord(targetPosition.x, targetPosition.y, targetPosition.z);
  game.setFocusPosAndVel(targetPosition.x, targetPosition.y, targetPosition.z, 0, 0, 0);

  loadSceneAtCoords(targetPosition);

  const front = game.getOffsetFromCoordAndHeadingInWorldCoords(
    targetPosition.x,
    targetPosition.y,
    targetPosition.z,
    0,
    0,
    1.5,
    0,
  );
  const back = game.getOffsetFromCoordAndHeadingInWorldCoords(
    targetPosition.x,
    targetPosition.y,
    targetPosition.z,
    0,
    0,
    -1.5,
    0,
  );

  everyTickWhile(
    () => camera !== undefined,
    () => {
      // Light for better view of a character (in the night especially)
      game.drawLightWithRange(front.x, front.y, front.z, 255, 234, 207, 5, 2);
      game.drawLightWithRange(back.x, back.y, back.z, 255, 234, 207, 5, 2);

      // Zoom controls
      game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_PREV, true);
      game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_NEXT, true);

      if (
        game.isDisabledControlJustPressed(
          ControlType.PLAYER_CONTROL,
          Control.INPUT_WEAPON_WHEEL_PREV,
        )
      ) {
        zoom = Math.max(0.35, zoom - 0.05);
      }
      if (
        game.isDisabledControlJustPressed(
          ControlType.PLAYER_CONTROL,
          Control.INPUT_WEAPON_WHEEL_NEXT,
        )
      ) {
        zoom = Math.min(1.5, zoom + 0.05);
      }

      updateCharacterCreationCameraPosition(targetPosition, cameraPositionBaseline);
    },
  );

  const webview = await waitForUserInterface();

  function onCameraMoveStart() {
    if (cameraControlInterval) {
      cameraControlInterval.destroy();
    }
    mouseStartPos = alt.Cursor.pos;
    cameraControlInterval = alt.Timers.everyTick(moveCharacterCreationCamera);
  }

  function onCameraMoveEnd() {
    if (cameraControlInterval) {
      cameraControlInterval.destroy();
      cameraControlInterval = undefined;
    }
  }

  webview.on(ClientEvents.FromWebview.CAMERA_MOVE_START, onCameraMoveStart);
  webview.on(ClientEvents.FromWebview.CAMERA_MOVE_END, onCameraMoveEnd);

  return () => {
    // cleanup
    webview.off(ClientEvents.FromWebview.CAMERA_MOVE_START, onCameraMoveStart);
    webview.off(ClientEvents.FromWebview.CAMERA_MOVE_END, onCameraMoveEnd);

    onCameraMoveEnd();

    game.clearFocus();
    game.destroyAllCams(true);
    game.renderScriptCams(false, false, 0, false, false, 0);

    cameraHorizontalOffset = 0;
    cameraVerticalOffset = 0;
    camera = undefined;
  };
}

export async function moveCharacterCreationCamera() {
  if (!camera) {
    return;
  }

  if (mouseStartPos) {
    const mousePos = alt.Cursor.pos;
    const mouseDiff = {
      x: mouseStartPos.x - mousePos.x,
      y: mouseStartPos.y - mousePos.y,
    };

    cameraHorizontalOffset += mouseDiff.x / 1000;
    cameraVerticalOffset -= mouseDiff.y / 1000;

    mouseStartPos = mousePos;
  }

  cameraVerticalOffset = Math.max(-0.6, Math.min(0.8, cameraVerticalOffset));
}

export function updateCharacterCreationCameraPosition(
  targetPosition: alt.Vector3,
  cameraPositionBaseline: alt.Vector3,
) {
  if (!camera) {
    alt.logWarning("updateCharacterCreationCameraPosition: no active camera found");
    return;
  }

  const x1 = targetPosition.x + Math.cos(cameraHorizontalOffset) * zoom;
  const y1 = targetPosition.y + Math.sin(cameraHorizontalOffset) * zoom;
  const z = cameraPositionBaseline.z + Math.tan(cameraVerticalOffset);

  game.setCamCoord(camera, x1, y1, z);

  game.pointCamAtCoord(camera, targetPosition.x, targetPosition.y, targetPosition.z + 0.8);
}
