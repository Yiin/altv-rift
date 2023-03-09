import alt from "alt-client";
import native from "natives";
import { KeyCode } from "altv-enums";
import { getGroundPos } from "@/utility/getGroundPos";

alt.on("keyup", async (key) => {
  switch (key) {
    case KeyCode.T: {
      if (alt.isKeyDown(KeyCode.Ctrl)) {
        tpToWaypoint().catch((e) => {
          alt.logError(e?.stack ?? e);
        });
      }
      break;
    }
  }
});

async function tpToWaypoint(): Promise<void> {
  const point = getWaypoint();
  if (!point) {
    alt.log("no waypoint to tp");
    return;
  }

  const groundPos = await getGroundPos(point);

  alt.emitServer("tp_to_waypoint", ...groundPos.toArray());
}

function getWaypoint(sprite = 8): alt.Vector3 | null {
  const waypoint = native.getFirstBlipInfoId(sprite);

  if (native.doesBlipExist(waypoint))
    return native.getBlipInfoIdCoord(waypoint);

  return null;
}
