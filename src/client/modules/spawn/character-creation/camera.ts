import alt from "@altv/client";
import game from "@altv/natives";
import { Bones } from "@shared/enums/bones";
import { ClientEvents } from "@shared/events/client";
import { loadSceneAtCoords } from "@/core/utility/scene";
import { Control, ControlType } from "@/core/constants/controls";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { useWebview } from "@/core/user-interface/webview";
import { whileEntityIsStreamedIn } from "@/core/game-state-hooks/entity-is-streamed-in.state";
import { vec3ToArr } from "@/core/utility/vectors";
import { getCharacterCreationPed } from "./character-ped";

const cameraPositionBaseline = new alt.Vector3(1508.8, -1731.9, 79.3);
let cameraHorizontalOffset = 0;
let cameraVerticalOffset = 0;
let zoom = 1;
let camera: number | undefined;
let pedPosition: alt.Vector3;
let cameraControlInterval: alt.Timers.EveryTick | undefined;
let unfocusPed = () => { };

export function createCharacterCreationCamera(ped: alt.LocalPed) {
  const fov = 60;
  const startCamPosition = cameraPositionBaseline;

  camera = game.createCamWithParams(
    "DEFAULT_SCRIPTED_CAMERA",
    ...vec3ToArr(startCamPosition),
    ...vec3ToArr(alt.Vector3.zero),
    fov,
    true,
    0
  );

  game.setCamActive(camera, true);
  game.renderScriptCams(true, false, 0, true, false, 0);

  alt.log(`Camera: ${camera}, ped: ${ped.scriptID}`);

  unfocusPed = whileEntityIsStreamedIn(
    (entity): entity is alt.LocalPed => {
      return entity === getCharacterCreationPed();
    },
    async (ped) => {
      if (!camera) {
        alt.log("no camera");
        return;
      }

      await ped.waitForSpawn();

      alt.log("focusing ped", ped.scriptID);

      game.pointCamAtPedBone(
        camera,
        ped,
        Bones.SKEL_Head,
        0, // -Math.cos(cameraHorizontalOffset) / 3,
        0, // -Math.sin(cameraHorizontalOffset) / 3,
        0.1,
        true
      );

      pedPosition = ped.pos;

      // Set Focus in the Area
      game.requestCollisionAtCoord(pedPosition.x, pedPosition.y, pedPosition.z);
      game.setFocusPosAndVel(pedPosition.x, pedPosition.y, pedPosition.z, 0, 0, 0);

      alt.log("loading scene", pedPosition);
      loadSceneAtCoords(pedPosition);

      const front = game.getOffsetFromEntityInWorldCoords(ped, 0, 1.5, 0);
      const back = game.getOffsetFromEntityInWorldCoords(ped, 0, -1.5, 0);

      everyTickWhile(
        () => camera !== undefined,
        () => {
          game.drawLightWithRange(front.x, front.y, front.z, 255, 234, 207, 5, 2);
          game.drawLightWithRange(back.x, back.y, back.z, 255, 234, 207, 5, 2);
        }
      );

      everyTickWhile(
        () => camera !== undefined,
        () => {
          if (
            game.isDisabledControlJustPressed(
              ControlType.PLAYER_CONTROL,
              Control.INPUT_WEAPON_WHEEL_PREV
            )
          ) {
            zoom = Math.max(0.35, zoom - 0.05);
          }
          if (
            game.isDisabledControlJustPressed(
              ControlType.PLAYER_CONTROL,
              Control.INPUT_WEAPON_WHEEL_NEXT
            )
          ) {
            zoom = Math.min(1.5, zoom + 0.05);
          }
          updateCharacterCreationCameraPosition();
        }
      );
    }
  );

  useWebview(webview => webview.on(ClientEvents.FromWebview.CAMERA_MOVE_START, () => {
    if (cameraControlInterval) {
      cameraControlInterval.destroy();
      cameraControlInterval = undefined;
    }
    mouseStartPos = alt.Cursor.pos;
    cameraControlInterval = alt.Timers.everyTick(moveCharacterCreationCamera);
  }));

  useWebview(webview => webview.on(ClientEvents.FromWebview.CAMERA_MOVE_END, () => {
    if (cameraControlInterval) {
      cameraControlInterval.destroy();
      cameraControlInterval = undefined;
    }
  }));
}

let mouseStartPos: alt.Vector2 | undefined;

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

export function updateCharacterCreationCameraPosition() {
  if (!camera) {
    alt.logWarning("no camera");
    return;
  }

  const x1 = pedPosition.x + Math.cos(cameraHorizontalOffset) * zoom;
  const y1 = pedPosition.y + Math.sin(cameraHorizontalOffset) * zoom;
  const z = cameraPositionBaseline.z + Math.tan(cameraVerticalOffset);

  game.setCamCoord(camera, x1, y1, z);

  const ped = getCharacterCreationPed();
  if (ped && ped.valid && ped.scriptID) {
    game.pointCamAtPedBone(
      camera,
      ped,
      Bones.SKEL_Head,
      0, // -Math.cos(cameraHorizontalOffset) / 3,
      0, // -Math.sin(cameraHorizontalOffset) / 3,
      0.1,
      true
    );
  }
}

export function destroyCharacterCreationCamera() {
  if (cameraControlInterval) {
    cameraControlInterval.destroy();
    cameraControlInterval = undefined;
  }

  unfocusPed();
  game.clearFocus();
  game.destroyAllCams(true);
  game.renderScriptCams(false, false, 0, false, false, 0);

  unfocusPed = () => { };
  cameraHorizontalOffset = 0;
  cameraVerticalOffset = 0;
  camera = undefined;
}
