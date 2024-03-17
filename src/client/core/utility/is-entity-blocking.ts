import alt from "@altv/client";
import { distance, distance2d } from "@shared/utility/vector";

/**
 * Check if an entity is in front of the position the camera is looking at.
 * Should be used periodically and not in an every tick. Could be expensive.
 */
export function isEntityBlockingPosition(
  pos: alt.IVector3,
  range = 0.8,
  maxDistance = 100,
): boolean {
  const closestPlayers = alt.Player.all.filter((target) => {
    const dist = distance2d(target.pos, pos);
    if (dist > maxDistance) {
      return false;
    }

    return true;
  });

  const closestVehicles = alt.Vehicle.all.filter((target) => {
    const dist = distance2d(target.pos, pos);
    if (dist > maxDistance) {
      return false;
    }

    return true;
  });

  const altPos = new alt.Vector3(pos);
  const A = alt.Cam.pos;
  const AB = altPos.sub(A).normalized;
  for (let i = 0; i < 100; i++) {
    const ABMult = AB.mul(range * i);
    const finalPos = A.add(ABMult);

    // If the final position is close enough to the position, return;
    const dist = distance(finalPos, pos);
    if (dist <= 1) {
      return false;
    }

    const isPlayerBlocking = closestPlayers.find(
      (target) => distance(target.pos, finalPos) <= range,
    );

    const isVehicleBlocking = closestVehicles.find(
      (target) => distance(target.pos, finalPos) <= range,
    );

    if (!isPlayerBlocking && !isVehicleBlocking) {
      continue;
    }

    return true;
  }

  return false;
}
