import * as alt from "@altv/client";
import * as game from "@altv/natives";

const top = [0, 1];
const bottom = [0, -1];
const left = [-1, 0];
const right = [1, 0];
const center = [0, 0];
const directions = [top, bottom, left, right, center];

export function testProbeAgainstWaterInFrontOfPlayer() {
  // Shoot 5 probes, check if all of them hit water, and if yes, return result of the last (center) once:
  const from = game.getOffsetFromEntityInWorldCoords(alt.Player.local, 0, 0.8, 0.7);
  let hit = false;
  let pos = { x: 0, y: 0, z: 0 };
  let target = { x: 0, y: 0, z: 0 };

  for (const [horizontal, vertical] of directions) {
    target = game.getOffsetFromEntityInWorldCoords(
      alt.Player.local,
      horizontal,
      10 + vertical,
      -10
    );
    [hit, pos] = game.testProbeAgainstWater(from.x, from.y, from.z, target.x, target.y, target.z);

    if (!hit) {
      break;
    }
  }

  return { hit, pos, from, target };
}
