import alt from "alt-client";
import game from "natives";
import { loadSceneAtCoords } from "./scene";
import { Timer } from "./timers";

let isLocalPlayer = false;
let scriptID: number | undefined;
let cameraControlsInterval: number | undefined;
let camera: number | undefined;
let zpos = 0;
let fov = 90;
let startPosition: alt.Vector3 | undefined;
let startCamPosition: alt.Vector3 | undefined;
let timeBetweenAnimChecks = Date.now() + 100;
let controlStatus = false;
let camUpdateQueue: { zpos: number; fov: number; easeTime: number }[] = [];
let isQueueReady = false;

const PedEditCamera = {
  /**
   * Creates a Pedestrian Edit Camera
   */
  async create(scriptID: number): Promise<void> {
    startPosition = game.getEntityCoords(scriptID, false);

    if (!camera) {
      const forwardVector: alt.Vector3 = game.getEntityForwardVector(
        isLocalPlayer ? alt.Player.local : scriptID
      ) as alt.Vector3;

      const forwardCameraPosition: alt.Vector3 = {
        x: startPosition.x + forwardVector.x * 1.2,
        y: startPosition.y + forwardVector.y * 1.2,
        z: startPosition.z + zpos,
      } as alt.Vector3;

      // Set Focus in the Area
      game.requestCollisionAtCoord(
        forwardCameraPosition.x,
        forwardCameraPosition.y,
        forwardCameraPosition.z
      );
      game.setFocusPosAndVel(
        forwardCameraPosition.x,
        forwardCameraPosition.y,
        forwardCameraPosition.z,
        0,
        0,
        0
      );
      await loadSceneAtCoords(forwardCameraPosition);

      fov = 90;
      startCamPosition = forwardCameraPosition;

      camera = game.createCamWithParams(
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

      game.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z);
      game.setCamActive(camera, true);
      game.renderScriptCams(true, false, 0, true, false, 0);
    }

    cameraControlsInterval = Timer.createInterval(PedEditCamera.handleControls, 0, "camera.ts");
  },

  /**
   * Calculates a camera offset.
   */
  calculateCamOffset(offset: alt.IVector3): alt.IVector3 {
    const entity = isLocalPlayer ? alt.Player.local : scriptID;

    if (!entity) {
      return new alt.Vector3(0, 0, 0);
    }

    return game.getOffsetFromEntityInWorldCoords(entity, offset.x, offset.y, offset.z);
  },

  /**
   * Sets up the camera with the original position and a new offset.
   */
  setCameraOffset(offset: alt.IVector3) {
    if (!camera) {
      return;
    }

    startPosition = PedEditCamera.calculateCamOffset(offset) as alt.Vector3;
    game.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z);
    game.setCamActive(camera, true);
    game.renderScriptCams(true, false, 0, true, false, 0);
  },

  /**
   * Check if a PedEditCamera exists.
   */
  exists() {
    return camera !== undefined;
  },

  /**
   * Destroy the Ped Edit Camera
   */
  async destroy() {
    if (cameraControlsInterval !== undefined || cameraControlsInterval !== undefined) {
      Timer.clearInterval(cameraControlsInterval);
      cameraControlsInterval = undefined;
    }

    if (camera) {
      game.destroyCam(camera, true);
      camera = undefined;
    }

    game.clearFocus();
    game.destroyAllCams(true);
    game.renderScriptCams(false, false, 0, false, false, 0);

    zpos = 0;
    fov = 90;
    startPosition = undefined;
    startCamPosition = undefined;
    isLocalPlayer = false;
    camUpdateQueue = [];
    isQueueReady = true;
    scriptID = undefined;
    controlStatus = false;
  },

  /**
   * Disable All Controls?
   */
  disableControls(status: boolean): void {
    controlStatus = status;
  },

  /**
   * Set the Camera Field of View
   */
  setCamParams(_zpos?: number, _fov?: number, _easeTime: number = 500) {
    if (_zpos === undefined) {
      _zpos = zpos;
    }

    if (_fov === undefined) {
      _fov = fov;
    }

    camUpdateQueue.push({ zpos: _zpos, fov: _fov, easeTime: _easeTime });
  },

  async runQueue() {
    if (!startPosition || !startCamPosition || !camera) {
      return;
    }

    if (camUpdateQueue.length <= 0) {
      return;
    }

    isQueueReady = false;

    const queueRef = camUpdateQueue.shift();
    if (!queueRef) {
      isQueueReady = true;
      return;
    }

    zpos = queueRef.zpos;
    fov = queueRef.fov;

    const camera2 = game.createCamWithParams(
      "DEFAULT_SCRIPTED_CAMERA",
      startCamPosition.x,
      startCamPosition.y,
      startCamPosition.z + zpos,
      0,
      0,
      0,
      fov,
      true,
      0
    );

    game.setCamFov(camera2, fov);
    game.pointCamAtCoord(camera2, startPosition.x, startPosition.y, startPosition.z + zpos);
    game.setCamActiveWithInterp(camera2, camera, queueRef.easeTime, 1, 1);
    game.renderScriptCams(true, true, queueRef.easeTime, true, false, 0);

    await new Promise((resolve: Function) => {
      alt.setTimeout(() => {
        resolve();
      }, queueRef.easeTime);
    });

    game.destroyCam(camera, true);
    camera = camera2;
    isQueueReady = true;
  },

  /**
   * Update the ScriptID for who we should use to rotate.
   */
  update(id: number) {
    scriptID = id;
  },

  handleControls() {
    game.hideHudAndRadarThisFrame();
    game.disableAllControlActions(0);
    game.disableAllControlActions(1);
    game.disableControlAction(0, 0, true);
    game.disableControlAction(0, 1, true);
    game.disableControlAction(0, 2, true);
    game.disableControlAction(0, 24, true);
    game.disableControlAction(0, 25, true);
    game.disableControlAction(0, 32, true); // w
    game.disableControlAction(0, 33, true); // s
    game.disableControlAction(0, 34, true); // a
    game.disableControlAction(0, 35, true); // d

    if (!startPosition || !startCamPosition || !camera) {
      return;
    }

    if (camera === undefined || camera === undefined) {
      return;
    }

    if (camUpdateQueue.length >= 1 && isQueueReady) {
      PedEditCamera.runQueue();
    }

    if (controlStatus) {
      return;
    }

    const entity = isLocalPlayer ? alt.Player.local : scriptID;

    if (!entity) {
      return;
    }

    if (!game.doesEntityExist(entity)) {
      return;
    }

    const [_, width] = game.getActualScreenResolution(0, 0);
    const cursor = alt.getCursorPos();
    const _x = cursor.x;
    let oldHeading = game.getEntityHeading(entity);

    // Scroll Up
    if (game.isDisabledControlPressed(0, 15)) {
      if (_x < width / 2 + 250 && _x > width / 2 - 250) {
        fov -= 2;

        if (fov < 10) {
          fov = 10;
        }

        game.setCamFov(camera, fov);
        game.setCamActive(camera, true);
        game.renderScriptCams(true, false, 0, true, false, 0);
      }
    }

    // SCroll Down
    if (game.isDisabledControlPressed(0, 16)) {
      if (_x < width / 2 + 250 && _x > width / 2 - 250) {
        fov += 2;

        if (fov > 130) {
          fov = 130;
        }

        game.setCamFov(camera, fov);
        game.setCamActive(camera, true);
        game.renderScriptCams(true, false, 0, true, false, 0);
      }
    }

    if (game.isDisabledControlPressed(0, 32)) {
      zpos += 0.01;

      if (zpos > 1.2) {
        zpos = 1.2;
      }

      game.setCamCoord(camera, startCamPosition.x, startCamPosition.y, startCamPosition.z + zpos);
      game.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z + zpos);
      game.setCamActive(camera, true);
      game.renderScriptCams(true, false, 0, true, false, 0);
    }

    if (game.isDisabledControlPressed(0, 33)) {
      zpos -= 0.01;

      if (zpos < -1.2) {
        zpos = -1.2;
      }

      game.setCamCoord(camera, startCamPosition.x, startCamPosition.y, startCamPosition.z + zpos);
      game.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z + zpos);
      game.setCamActive(camera, true);
      game.renderScriptCams(true, false, 0, true, false, 0);
    }

    // rmb
    if (game.isDisabledControlPressed(0, 25)) {
      // Rotate Negative
      if (_x < width / 2) {
        const newHeading = (oldHeading -= 2);
        game.setEntityHeading(entity, newHeading);
      }

      // Rotate Positive
      if (_x > width / 2) {
        const newHeading = (oldHeading += 2);
        game.setEntityHeading(entity, newHeading);
      }
    }

    // d
    if (game.isDisabledControlPressed(0, 35)) {
      const newHeading = (oldHeading += 2);
      game.setEntityHeading(entity, newHeading);
    }

    // a
    if (game.isDisabledControlPressed(0, 34)) {
      const newHeading = (oldHeading -= 2);
      game.setEntityHeading(entity, newHeading);
    }

    if (Date.now() > timeBetweenAnimChecks) {
      timeBetweenAnimChecks = Date.now() + 1500;
      if (!game.isEntityPlayingAnim(entity, "nm@hands", "hands_up", 3)) {
        alt.emit("animation:Play", {
          dict: "nm@hands",
          name: "hands_up",
          duration: -1,
          flag: 2,
        });
      }
    }
  },
};

export default PedEditCamera;

alt.on("connectionComplete", () => {
  PedEditCamera.destroy();
});

alt.on("disconnect", () => {
  PedEditCamera.destroy();
});
