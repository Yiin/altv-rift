import alt from "alt-client";
import native from "natives";
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
  async create(
    scriptID: number,
  ): Promise<void> {
    startPosition = native.getEntityCoords(scriptID, false);

    if (!camera) {
      const forwardVector: alt.Vector3 = native.getEntityForwardVector(
        isLocalPlayer ? alt.Player.local.scriptID : scriptID
      ) as alt.Vector3;

      const forwardCameraPosition: alt.Vector3 = {
        x: startPosition.x + forwardVector.x * 1.2,
        y: startPosition.y + forwardVector.y * 1.2,
        z: startPosition.z + zpos,
      } as alt.Vector3;

      // Set Focus in the Area
      native.requestCollisionAtCoord(
        forwardCameraPosition.x,
        forwardCameraPosition.y,
        forwardCameraPosition.z
      );
      native.setFocusPosAndVel(
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

      native.pointCamAtCoord(
        camera,
        startPosition.x,
        startPosition.y,
        startPosition.z
      );
      native.setCamActive(camera, true);
      native.renderScriptCams(true, false, 0, true, false, 0);
    }

    cameraControlsInterval = Timer.createInterval(
      PedEditCamera.handleControls,
      0,
      "camera.ts"
    );
  },

  /**
   * Calculates a camera offset.
   */
  calculateCamOffset(offset: alt.IVector3): alt.IVector3 {
    const entity = isLocalPlayer ? alt.Player.local.scriptID : scriptID;

    if (!entity) {
      return new alt.Vector3(0, 0, 0);
    }

    return native.getOffsetFromEntityInWorldCoords(
      entity,
      offset.x,
      offset.y,
      offset.z
    );
  },

  /**
   * Sets up the camera with the original position and a new offset.
   */
  setCameraOffset(offset: alt.IVector3) {
    if (!camera) {
      return;
    }

    startPosition = PedEditCamera.calculateCamOffset(offset) as alt.Vector3;
    native.pointCamAtCoord(
      camera,
      startPosition.x,
      startPosition.y,
      startPosition.z
    );
    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);
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
    if (
      cameraControlsInterval !== undefined ||
      cameraControlsInterval !== undefined
    ) {
      Timer.clearInterval(cameraControlsInterval);
      cameraControlsInterval = undefined;
    }

    if (camera) {
      native.destroyCam(camera, true);
      camera = undefined;
    }

    native.clearFocus();
    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);

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

    const camera2 = native.createCamWithParams(
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

    native.setCamFov(camera2, fov);
    native.pointCamAtCoord(
      camera2,
      startPosition.x,
      startPosition.y,
      startPosition.z + zpos
    );
    native.setCamActiveWithInterp(camera2, camera, queueRef.easeTime, 1, 1);
    native.renderScriptCams(true, true, queueRef.easeTime, true, false, 0);

    await new Promise((resolve: Function) => {
      alt.setTimeout(() => {
        resolve();
      }, queueRef.easeTime);
    });

    native.destroyCam(camera, true);
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
    native.hideHudAndRadarThisFrame();
    native.disableAllControlActions(0);
    native.disableAllControlActions(1);
    native.disableControlAction(0, 0, true);
    native.disableControlAction(0, 1, true);
    native.disableControlAction(0, 2, true);
    native.disableControlAction(0, 24, true);
    native.disableControlAction(0, 25, true);
    native.disableControlAction(0, 32, true); // w
    native.disableControlAction(0, 33, true); // s
    native.disableControlAction(0, 34, true); // a
    native.disableControlAction(0, 35, true); // d

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

    const entity = isLocalPlayer ? alt.Player.local.scriptID : scriptID;

    if (!entity) {
      return;
    }

    if (!native.doesEntityExist(entity)) {
      return;
    }

    const [_, width] = native.getActualScreenResolution(0, 0);
    const cursor = alt.getCursorPos();
    const _x = cursor.x;
    let oldHeading = native.getEntityHeading(entity);

    // Scroll Up
    if (native.isDisabledControlPressed(0, 15)) {
      if (_x < width / 2 + 250 && _x > width / 2 - 250) {
        fov -= 2;

        if (fov < 10) {
          fov = 10;
        }

        native.setCamFov(camera, fov);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, 0);
      }
    }

    // SCroll Down
    if (native.isDisabledControlPressed(0, 16)) {
      if (_x < width / 2 + 250 && _x > width / 2 - 250) {
        fov += 2;

        if (fov > 130) {
          fov = 130;
        }

        native.setCamFov(camera, fov);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, 0);
      }
    }

    if (native.isDisabledControlPressed(0, 32)) {
      zpos += 0.01;

      if (zpos > 1.2) {
        zpos = 1.2;
      }

      native.setCamCoord(
        camera,
        startCamPosition.x,
        startCamPosition.y,
        startCamPosition.z + zpos
      );
      native.pointCamAtCoord(
        camera,
        startPosition.x,
        startPosition.y,
        startPosition.z + zpos
      );
      native.setCamActive(camera, true);
      native.renderScriptCams(true, false, 0, true, false, 0);
    }

    if (native.isDisabledControlPressed(0, 33)) {
      zpos -= 0.01;

      if (zpos < -1.2) {
        zpos = -1.2;
      }

      native.setCamCoord(
        camera,
        startCamPosition.x,
        startCamPosition.y,
        startCamPosition.z + zpos
      );
      native.pointCamAtCoord(
        camera,
        startPosition.x,
        startPosition.y,
        startPosition.z + zpos
      );
      native.setCamActive(camera, true);
      native.renderScriptCams(true, false, 0, true, false, 0);
    }

    // rmb
    if (native.isDisabledControlPressed(0, 25)) {
      // Rotate Negative
      if (_x < width / 2) {
        const newHeading = (oldHeading -= 2);
        native.setEntityHeading(entity, newHeading);
      }

      // Rotate Positive
      if (_x > width / 2) {
        const newHeading = (oldHeading += 2);
        native.setEntityHeading(entity, newHeading);
      }
    }

    // d
    if (native.isDisabledControlPressed(0, 35)) {
      const newHeading = (oldHeading += 2);
      native.setEntityHeading(entity, newHeading);
    }

    // a
    if (native.isDisabledControlPressed(0, 34)) {
      const newHeading = (oldHeading -= 2);
      native.setEntityHeading(entity, newHeading);
    }

    if (Date.now() > timeBetweenAnimChecks) {
      timeBetweenAnimChecks = Date.now() + 1500;
      if (!native.isEntityPlayingAnim(entity, "nm@hands", "hands_up", 3)) {
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
