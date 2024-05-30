import alt from "@altv/client";
import game from "@altv/natives";
import { getPointsInCircle } from "./math";
import { loadSceneAtCoords } from "./scene";

let isUpdating = false;
let nodes: iCameraNode[] = [];
let currentCamIndex = -1;
let cam1: number | undefined;
let cam2: number | undefined;

interface iCameraNode {
  /**
   * Position for where to create this camera.
   */
  pos: alt.IVector3;

  /**
   * Rotation of the camera, if applicable.
   * Also applies as rotation for entity attachment if applicable.
   */
  rot?: alt.IVector3;

  /**
   * Applies to entity attachment, and the offset from said entity.
   */
  offset?: alt.IVector3;

  /**
   * The FOV for the camera. Default is set to 90.
   */
  fov: number;

  /**
   * Time to ease between camera nodes. If only one camera node is present it does not apply.
   */
  easeTime?: number;

  /**
   * The entity `scriptID` to follow with the camera.
   */
  entityToTrack?: number;

  /**
   * A position to point that camera towards if applicable.
   */
  positionToTrack?: alt.IVector3;

  /**
   * The entity to attach this camera to, can be a vehicle, ped, etc.
   * Use `scriptID` for this.
   */
  entityToAttachTo?: number;

  /**
   * A vehicle bone index to attach to if `entityToAttachTo` is specified
   */
  vehicleBone?: number;

  /**
   * A pedestrian bone index to attach to if `entityToAttachTo` is specified
   */
  pedBone?: number;

  /**
   * If this is the last camera node, should we destroy the camera after easeTime?
   */
  isLastNode?: boolean;
}

const InternalFunctions = {
  /**
   * Check if the camera is currently moving between nodes.
   */
  async isCameraUpdating() {
    return new Promise((resolve: Function) => {
      const interval = alt.Timers.setInterval(() => {
        if (isUpdating) {
          return;
        }

        interval.destroy();
        resolve();
      }, 25);
    });
  },

  /**
   * Create a camera at the given position
   */
  async next(node: iCameraNode): Promise<void> {
    if (!node) {
      return;
    }

    if (isUpdating) {
      return;
    }

    isUpdating = true;

    game.requestCollisionAtCoord(node.pos.x, node.pos.y, node.pos.z);
    game.setFocusPosAndVel(node.pos.x, node.pos.y, node.pos.z, 0, 0, 0);
    await loadSceneAtCoords(node.pos);
    let assignCam2to1 = false;
    let camNumber: number;

    if (cam1) {
      cam2 = game.createCamWithParams(
        "DEFAULT_SCRIPTED_CAMERA",
        node.pos.x,
        node.pos.y,
        node.pos.z,
        0,
        0,
        0,
        90,
        true,
        0,
      );

      camNumber = cam2;
      assignCam2to1 = true;
    } else {
      cam1 = game.createCamWithParams(
        "DEFAULT_SCRIPTED_CAMERA",
        node.pos.x,
        node.pos.y,
        node.pos.z,
        0,
        0,
        0,
        90,
        true,
        0,
      );

      game.setCamActive(cam1, true);
      camNumber = cam1;
      assignCam2to1 = false;
      cam2 = undefined;
    }

    if (node.rot) {
      game.setCamRot(camNumber, node.rot.x, node.rot.y, node.rot.z, 2);
    }

    if (node.fov) {
      game.setCamFov(camNumber, node.fov);
    }

    if (node.positionToTrack) {
      game.pointCamAtCoord(
        camNumber,
        node.positionToTrack.x,
        node.positionToTrack.y,
        node.positionToTrack.z,
      );
    }

    if (node.entityToTrack) {
      const offset = node.offset ? node.offset : { x: 0, y: 0, z: 0 };
      game.pointCamAtEntity(camNumber, node.entityToTrack, offset.x, offset.y, offset.z, true);
    }

    if (node.vehicleBone && node.entityToAttachTo) {
      const offset = node.offset ? node.offset : { x: 0, y: 0, z: 0 };
      const rot = node.rot ? node.rot : { x: 0, y: 0, z: 0 };
      game.attachCamToVehicleBone(
        camNumber,
        node.entityToAttachTo,
        node.vehicleBone,
        true,
        rot.x,
        rot.y,
        rot.z,
        offset.x,
        offset.y,
        offset.z,
        false,
      );
    }

    if (node.pedBone && node.entityToAttachTo) {
      const offset = node.offset ? node.offset : { x: 0, y: 0, z: 0 };
      game.attachCamToPedBone(
        camNumber,
        node.entityToAttachTo,
        node.vehicleBone!,
        offset.x,
        offset.y,
        offset.z,
        true,
      );
    }

    if (node.entityToAttachTo && !node.pedBone && !node.vehicleBone) {
      const offset = node.offset ? node.offset : { x: 0, y: 0, z: 0 };
      game.attachCamToEntity(camNumber, node.entityToAttachTo, offset.x, offset.y, offset.z, true);
    }

    game.renderScriptCams(true, true, node.easeTime ? node.easeTime : 0, true, false, 0);

    if (cam1 && cam2) {
      game.setCamActiveWithInterp(cam2, cam1, node.easeTime ? node.easeTime : 0, 1, 1);
    }

    await new Promise((resolve: Function) => {
      alt.Timers.setTimeout(
        () => {
          resolve();

          if (node.isLastNode) {
            InternalFunctions.destroy();
          }

          if (assignCam2to1) {
            if (cam1 !== null && cam1 !== undefined) {
              game.destroyCam(cam1, true);
            }

            cam1 = cam2;
            cam2 = undefined;
          }

          isUpdating = false;
        },
        node.easeTime ? node.easeTime * 2 : 0,
      );
    });
  },

  /**
   * Clears current camera but does not clear nodes.
   */
  async clear() {
    if (cam1) {
      game.destroyCam(cam1, true);
      cam1 = undefined;
    }

    if (cam2) {
      game.destroyCam(cam2, true);
      cam2 = undefined;
    }

    game.clearFocus();
    game.destroyAllCams(true);
    game.renderScriptCams(false, false, 0, false, false, 0);

    currentCamIndex = -1;
  },

  /**
   * Destroy all cameras and clear the focus
   */
  async destroy() {
    isUpdating = false;
    InternalFunctions.clear();
    while (nodes.length >= 1) {
      nodes.pop();
    }
  },
};

export const CinematicCam = {
  /**
   * This function will destroy all camera instances
   */
  async destroy(): Promise<void> {
    return await InternalFunctions.destroy();
  },

  async overrideNodes(_nodes: iCameraNode[]) {
    nodes = _nodes;
  },

  /**
   * Add a camera node to the camera set.
   */
  async addNode(node: iCameraNode) {
    if (!node.pos) {
      throw new Error("Camera Node -> Error: Position was not set for camera node.");
    }

    if (!node.fov) {
      node.fov = 90;
    }

    if (node.entityToTrack && !game.doesEntityExist(node.entityToTrack)) {
      throw new Error("Camera Node -> Error: Entity set to tracked does not exist.");
    }

    nodes.push(node);
  },

  /**
   * Goes to the next camera.
   *
   * If `false` is passed in the function it will not remove a camera
   * from the camera array. Allows for repeating camera movement over and over.
   */
  async next(removeFromArray = true): Promise<boolean> {
    if (!nodes.length) {
      return false;
    }

    await InternalFunctions.isCameraUpdating();

    if (removeFromArray) {
      const nextCam = nodes.shift()!;
      await InternalFunctions.next(nextCam);
    } else {
      currentCamIndex += 1;

      if (currentCamIndex >= nodes.length) {
        currentCamIndex = 0;
      }

      const nextCam = nodes[currentCamIndex]!;
      await InternalFunctions.next(nextCam);
    }

    return true;
  },

  /**
   * Play all camera nodes, but do not clear the camera nodes array.
   */
  async play() {
    for (const node of nodes) {
      await InternalFunctions.isCameraUpdating();
      await InternalFunctions.next(node);
    }
  },

  demo() {
    alt.Timers.setTimeout(() => {
      game.setEntityCoordsNoOffset(
        alt.Player.local,
        -383.385375976562,
        -120.65264892578125,
        38.68716812133789,
        false,
        false,
        false,
      );

      const points = getPointsInCircle(8, 2, {
        x: -383.385375976562,
        y: -120.65264892578125,
      });
      for (let i = 0; i < points.length; i++) {
        CinematicCam.addNode({
          pos: { x: points[i]!.x, y: points[i]!.y, z: alt.Player.local.pos.z },
          fov: 90,
          entityToTrack: alt.Player.local.scriptID,
          easeTime: 1000,
          isLastNode: i === points.length - 1,
        });
      }

      /* This is a function that will play all of the camera nodes in the array.
       */
      CinematicCam.play();
    }, 1500);
  },
};

// alt.Events.onServer(SYSTEM_EVENTS.TICKS_START, CinematicCam.demo);
