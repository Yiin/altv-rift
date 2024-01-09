import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { getDirectionFromRotation, rotationToDirection } from "./math";

const Raycast = {
  performRaycast(
    start: alt.IVector3,
    end: alt.IVector3,
    flags = 524287,
    radius: number = 5,
    useShapeTest = false
  ) {
    let raycast: number;

    // Ignore vehicle if in one.
    if (alt.Player.local.vehicle) {
      game.setEntityCollision(alt.Player.local.vehicle, false, true);
    }

    if (!useShapeTest) {
      raycast = game.startExpensiveSynchronousShapeTestLosProbe(
        start.x,
        start.y,
        start.z,
        end.x,
        end.y,
        end.z,
        flags,
        alt.Player.local,
        0
      );
    } else {
      raycast = game.startShapeTestCapsule(
        start.x,
        start.y,
        start.z,
        end.x,
        end.y,
        end.z,
        radius,
        flags,
        alt.Player.local,
        7
      );
    }

    // Re-Toggle Vehicle
    if (alt.Player.local.vehicle) {
      game.setEntityCollision(alt.Player.local.vehicle, true, true);
    }

    const [status, didHit, position, surfaceNormal, entityHit] = game.getShapeTestResult(raycast);
    console.log(typeof entityHit);
    return {
      didComplete: [0, 2].includes(status),
      didHit,
      position,
      surfaceNormal,
      // @ts-expect-error
      entityHit: typeof entityHit === "number" ? entityHit : entityHit.scriptID,
    };
  },

  /**
   * Raycast from the gameplay camera position.
   * Credit: Splak for gameplay camera snippet.
   */
  positionFromCamera(
    flags: number = -1,
    useShapeTest: boolean = false,
    radius: number = 5
  ): alt.IVector3 | null {
    const start = alt.Cam.pos;
    const forwardVector = rotationToDirection(game.getFinalRenderedCamRot(2));
    const end = {
      x: start.x + forwardVector.x * 2000,
      y: start.y + forwardVector.y * 2000,
      z: start.z + forwardVector.z * 2000,
    };

    const { didComplete, didHit, position } = Raycast.performRaycast(
      start,
      end,
      flags,
      radius,
      useShapeTest
    );

    if (!didComplete || !didHit) {
      return null;
    }

    return position;
  },

  /**
   * A raycast that returns information about what and who may have been hit.
   * The raycast is performed from the camera rotation / position to a further end location.
   */
  simpleRaycast(
    flags: number = -1,
    maxDistance = 25,
    useShapeTest: boolean = true,
    radius: number = 2
  ): {
    didComplete: boolean;
    didHit?: boolean;
    position?: alt.IVector3;
    entityHit?: number;
  } {
    const start = game.getFinalRenderedCamCoord();
    const forwardVector = getDirectionFromRotation(game.getFinalRenderedCamRot(2));
    const end = {
      x: start.x + forwardVector.x * maxDistance,
      y: start.y + forwardVector.y * maxDistance,
      z: start.z + forwardVector.z * maxDistance,
    };

    const { didHit, position, entityHit } = Raycast.performRaycast(
      start,
      end,
      flags,
      radius,
      useShapeTest
    );

    if (!didHit) {
      return { didComplete: false };
    }

    return {
      didComplete: true,
      didHit,
      position,
      entityHit,
    };
  },

  /**
   * Raycast in the player's facing direction.
   */
  simpleRaycastPlayersView(
    flags: number = -1,
    maxDistance = 25,
    useShapeTest: boolean = true,
    radius: number = 2
  ): {
    didComplete: boolean;
    didHit?: boolean;
    position?: alt.IVector3;
    entityHit?: number;
  } {
    const start = alt.Player.local.pos;
    const forwardVector = game.getEntityForwardVector(alt.Player.local);
    const end = {
      x: start.x + forwardVector.x * maxDistance,
      y: start.y + forwardVector.y * maxDistance,
      z: start.z + forwardVector.z * maxDistance,
    };

    const { didComplete, didHit, position, entityHit } = Raycast.performRaycast(
      start,
      end,
      flags,
      radius,
      useShapeTest
    );

    if (!didComplete || !didHit) {
      return { didComplete: false };
    }

    return {
      didComplete: true,
      didHit,
      position,
      entityHit,
    };
  },

  /**
   * Perform Raycast in the player's facing direction and return position.
   */
  positionFromPlayer(
    flags: number = -1,
    useShapeTest: boolean = false,
    radius: number = 5
  ): alt.IVector3 | null {
    const start = alt.Player.local.pos;
    const forwardVector = game.getEntityForwardVector(alt.Player.local);
    const end = {
      x: start.x + forwardVector.x * 2000,
      y: start.y + forwardVector.y * 2000,
      z: start.z + forwardVector.z * 2000,
    };

    const { didComplete, didHit, position } = Raycast.performRaycast(
      start,
      end,
      flags,
      radius,
      useShapeTest
    );

    if (!didComplete || !didHit) {
      return null;
    }

    return position;
  },

  /**
   * Used to get if the player is currently facing water.
   * Credit: Alexa for quick snippet.
   */
  isFacingWater(): null | alt.IVector3 {
    const headPosition = game.getPedBoneCoords(alt.Player.local, 31086, 0, 0, 0);
    const offsetPosition = game.getOffsetFromEntityInWorldCoords(alt.Player.local, 0, 50, -25);
    const [hit, position] = game.testProbeAgainstWater(
      headPosition.x,
      headPosition.y,
      headPosition.z,
      offsetPosition.x,
      offsetPosition.y,
      offsetPosition.z
    );

    if (!hit) {
      return null;
    }

    return position;
  },
};

export default Raycast;
