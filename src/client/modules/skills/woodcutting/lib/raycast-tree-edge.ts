import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { getPointNextToPointRelativeToPoint } from "@/core/utility/math";
import { LOS_FLAGS } from "@/core/constants/shapetest";
import { MaterialHash } from "../material-hash";

const player = alt.Player.local;

export function raycastTreeEdge(
  playerPos: alt.Vector3,
  treePos: alt.IVector3,
  offset: number
): alt.Vector3 | null {
  const flags = LOS_FLAGS.INCLUDE_ALL;
  const options = 0;

  const { x, y } = getPointNextToPointRelativeToPoint(player.pos, treePos, -1);

  const targetPos = new alt.Vector3({ x, y, z: treePos.z });

  // Calculate the direction from the player to the tree
  const direction = targetPos.sub(playerPos).normalized;

  // Find the perpendicular direction to create a vertical rectangle
  const perpendicular = new alt.Vector3(-direction.y, direction.x, 0).normalized;

  // Initialize variables to track the closest hit
  let closestHit: null | alt.Vector3 = null;
  let minDistance = Number.MAX_VALUE;

  // Loop to perform 5 raycasts
  for (let i = -2; i <= 2; i++) {
    const offsetVector = perpendicular.mul(offset * i);
    const startPos = playerPos.add(0, 0, 0.7).add(offsetVector);
    const endPos = targetPos.add(offsetVector);

    // Perform the raycast
    const hitTest = game.startExpensiveSynchronousShapeTestLosProbe(
      startPos.x,
      startPos.y,
      startPos.z,
      endPos.x,
      endPos.y,
      endPos.z,
      flags,
      player,
      options
    );
    const [_didComplete, didHit, position, _surfaceNormal, materialHash, _entityHit] =
      game.getShapeTestResultIncludingMaterial(hitTest);

    // If hit, calculate the distance and update the closest hit if necessary
    if (didHit && materialHash === MaterialHash.TreeBark) {
      const distance = playerPos.distanceTo(position);
      if (distance < minDistance) {
        minDistance = distance;
        closestHit = position;
      }
    }
  }

  return closestHit;
}
