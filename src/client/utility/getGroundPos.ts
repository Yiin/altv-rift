import alt from "alt-client";
import native from "natives";
import { LOS_FLAGS } from "@/modules/npc/constants/shapetest";
import Raycast from "./raycast";

export async function getGroundPos(
  point: alt.Vector3,
  flags?: LOS_FLAGS
): Promise<alt.Vector3> {
  alt.FocusData.overrideFocus(point);
  const startPos = new alt.Vector3(point.x, point.y, 1500);
  let destPos = startPos;
  let groundPos: alt.Vector3 | null = null;

  try {
    await alt.Utils.waitFor(() => {
      destPos = destPos.sub(0, 0, 200.0);

      alt.FocusData.overrideFocus(point);

      if (destPos.z < -500) throw new Error("failed to get ground pos");

      const raycast = Raycast.performRaycast(startPos, destPos, flags);

      if (!raycast.didHit) return false;

      groundPos =
        raycast.surfaceNormal.mul(1, 1, 0).distanceTo(point.mul(1, 1, 0)) > 1
          ? raycast.position
          : raycast.surfaceNormal;

      return true;
    }, 3000);
  } catch {}

  if (!groundPos) {
    alt.logWarning(
      "failed to get ground pos for waypoint, trying getGroundZ native..."
    );

    alt.FocusData.overrideFocus(point);

    let foundZ: number | null = null;
    try {
      await alt.Utils.waitFor(() => {
        const [found, z] = native.getGroundZAndNormalFor3dCoord(
          point.x,
          point.y,
          9999
        );
        if (!found) return false;

        foundZ = z;
        return true;
      }, 3000);
    } catch {}

    if (foundZ == null) {
      alt.logError("failed to get ground z for waypoint");
      groundPos = startPos;
    } else {
      groundPos = new alt.Vector3(point.x, point.y, foundZ);
    }
  }

  alt.FocusData.clearFocus();

  if (!groundPos) {
    throw new Error("no groundPos");
  }

  // groundPos = groundPos.add(0, 0, 1.0);

  return groundPos;
}
