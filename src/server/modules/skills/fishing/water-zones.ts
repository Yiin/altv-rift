import * as alt from "@altv/server";
import { PlayerFlags } from "@shared/store/game-state.store";
import { isInGame } from "@/utility/assertions";
import WATER_ZONES from "./water-zones.json";

declare module "@altv/server" {
  interface ICustomColshapeMeta {
    isWaterZone?: boolean;
  }
}

// Cayo Perico
WATER_ZONES.push({
  x: 4840.571,
  y: -5174.425,
  z: 0,
  radius: 3000,
});

const waterZones = WATER_ZONES.map((zone) => {
  const colshape = alt.ColShapeCircle.create({
    // @ts-expect-error remove z when api is fixed
    pos: { x: zone.x, y: zone.y, z: 0 },
    radius: zone.radius,
  });

  if (!colshape) {
    throw new Error(`Failed to create colshape for water zone.`);
  }

  colshape.meta.isWaterZone = true;
  return colshape;
});

export function getWaterZones() {
  return waterZones;
}

alt.Events.onEntityColShapeEnter(({ colShape, entity }) => {
  if (entity instanceof alt.Player && isInGame(entity) && colShape.meta.isWaterZone) {
    alt.log(`Player entered water zone.`);
    entity.gameState.flags.add(PlayerFlags.InFishingArea);
  }
});

alt.Events.onEntityColShapeLeave(({ colShape, entity }) => {
  if (entity instanceof alt.Player && isInGame(entity) && colShape.meta.isWaterZone) {
    if (waterZones.some((zone) => zone.isEntityIn(entity))) {
      return;
    }
    alt.log(`Player left water zone.`);
    entity.gameState.flags.delete(PlayerFlags.InFishingArea);
  }
});
