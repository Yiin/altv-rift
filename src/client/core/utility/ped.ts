import alt from "@altv/client";
import game from "@altv/natives";
import { ANIM_DICTS } from "@/core/constants/anim-dicts";
import { ANIM_TYPE } from "@/core/constants/entity";
import { COMMON_SCENARIOS } from "@/core/constants/scenarios";

export function isPedUnderVehicle(ped: number): boolean {
  if (!game.isPedProne(ped) && !game.isPedGettingUp(ped)) {
    return false;
  }

  const { x, y, z } = game.getEntityCoords(ped, false);

  const closestVehicle = alt.Vehicle.streamedIn.reduce(
    (closest, v) => {
      const dist = game.getDistanceBetweenCoords(x, y, z, v.pos.x, v.pos.y, v.pos.z, true);
      if (dist < closest.distance) {
        return { distance: dist, vehicle: v };
      }
      return closest;
    },
    {
      distance: Number.MAX_SAFE_INTEGER,
      vehicle: null as alt.Vehicle | null,
    },
  );
  if (!closestVehicle.vehicle) {
    return false;
  }
  const [back, front] = game.getModelDimensions(closestVehicle.vehicle.model);
  const frontPos = game.getOffsetFromEntityInWorldCoords(
    closestVehicle.vehicle,
    front.x,
    front.y,
    0,
  );
  const backPos = game.getOffsetFromEntityInWorldCoords(closestVehicle.vehicle, back.x, back.y, 0);
  const frontDist = game.getDistanceBetweenCoords(
    x,
    y,
    z,
    frontPos.x,
    frontPos.y,
    frontPos.z,
    true,
  );
  const centerDist = game.getDistanceBetweenCoords(
    x,
    y,
    z,
    closestVehicle.vehicle.pos.x,
    closestVehicle.vehicle.pos.y,
    closestVehicle.vehicle.pos.z,
    true,
  );
  const backDist = game.getDistanceBetweenCoords(x, y, z, backPos.x, backPos.y, backPos.z, true);

  return centerDist < 2.5 || frontDist < 2.5 || backDist < 2.5;
}

export function getCurrentAnimation(ped: number) {
  const currentScenario = COMMON_SCENARIOS.find(([name]) => game.isPedUsingScenario(ped, name));

  if (!currentScenario) {
    return null;
  }

  const possibleDicts = ANIM_DICTS.filter((anim) =>
    anim.DictionaryName.includes(currentScenario[0].toLowerCase()),
  );

  for (const dict of possibleDicts) {
    for (const anim of dict.Animations) {
      if (game.isEntityPlayingAnim(ped, dict.DictionaryName, anim, ANIM_TYPE.ANIM_DEFAULT)) {
        return { dict: dict.DictionaryName, anim: anim };
      }
    }
  }
  return null; // no matching animation found
}
