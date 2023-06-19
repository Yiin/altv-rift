import alt from "alt-client";
import native from "natives";
import { ANIM_DICTS } from "@/modules/npc/constants/anim-dicts";
import { ANIM_TYPE } from "@/modules/npc/constants/entity";
import { COMMON_SCENARIOS } from "@/modules/npc/constants/scenarios";

export function isPedUnderVehicle(ped: number): boolean {
  if (!native.isPedProne(ped) && !native.isPedGettingUp(ped)) {
    return false;
  }

  const { x, y, z } = native.getEntityCoords(ped, false);

  const closestVehicle = alt.Vehicle.streamedIn.reduce(
    (closest, v) => {
      const dist = native.getDistanceBetweenCoords(
        x,
        y,
        z,
        v.pos.x,
        v.pos.y,
        v.pos.z,
        true
      );
      if (dist < closest.distance) {
        return { distance: dist, vehicle: v };
      }
      return closest;
    },
    {
      distance: Number.MAX_SAFE_INTEGER,
      vehicle: null as alt.Vehicle | null,
    }
  );
  if (!closestVehicle.vehicle) {
    return false;
  }
  const [, back, front] = native.getModelDimensions(
    closestVehicle.vehicle.model
  );
  const frontPos = native.getOffsetFromEntityInWorldCoords(
    closestVehicle.vehicle.scriptID,
    front.x,
    front.y,
    0
  );
  const backPos = native.getOffsetFromEntityInWorldCoords(
    closestVehicle.vehicle.scriptID,
    back.x,
    back.y,
    0
  );
  const frontDist = native.getDistanceBetweenCoords(
    x,
    y,
    z,
    frontPos.x,
    frontPos.y,
    frontPos.z,
    true
  );
  const centerDist = native.getDistanceBetweenCoords(
    x,
    y,
    z,
    closestVehicle.vehicle.pos.x,
    closestVehicle.vehicle.pos.y,
    closestVehicle.vehicle.pos.z,
    true
  );
  const backDist = native.getDistanceBetweenCoords(
    x,
    y,
    z,
    backPos.x,
    backPos.y,
    backPos.z,
    true
  );

  return centerDist < 2.5 || frontDist < 2.5 || backDist < 2.5;
}

export function getCurrentAnimation(ped: number) {
  const currentScenario = COMMON_SCENARIOS.find(([name]) =>
    native.isPedUsingScenario(ped, name)
  );

  if (!currentScenario) {
    return null;
  }

  const possibleDicts = ANIM_DICTS.filter((anim) =>
    anim.DictionaryName.includes(currentScenario[0].toLowerCase())
  );

  for (const dict of possibleDicts) {
    for (const anim of dict.Animations) {
      if (
        native.isEntityPlayingAnim(
          ped,
          dict.DictionaryName,
          anim,
          ANIM_TYPE.ANIM_DEFAULT
        )
      ) {
        return { dict: dict.DictionaryName, anim: anim };
      }
    }
  }
  return null; // no matching animation found
}
