import * as alt from "@altv/client";
import game from "@altv/natives";

const zeroVector = { x: 0, y: 0, z: 0 };

/**
 * Draw a marker in an every tick.
 */
export function drawMarker(
  type: number,
  pos: alt.IVector3,
  scale: alt.IVector3,
  color: alt.RGBA,
  bobUpAndDown: boolean = false,
  faceCamera: boolean = true,
  rotate: boolean = false
) {
  game.drawMarker(
    type,
    pos.x,
    pos.y,
    pos.z,
    zeroVector.x,
    zeroVector.y,
    zeroVector.z,
    zeroVector.x,
    zeroVector.y,
    zeroVector.z,
    scale.x,
    scale.y,
    scale.z,
    color.r,
    color.g,
    color.b,
    color.a,
    bobUpAndDown,
    faceCamera,
    2,
    rotate,
    "",
    "",
    false
  );
}
