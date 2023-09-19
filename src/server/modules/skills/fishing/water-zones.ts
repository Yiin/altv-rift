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
    pos: { x: zone.x, y: zone.y },
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
    entity.gameState.flags.add(PlayerFlags.InFishingArea);
  }
});

alt.Events.onEntityColShapeLeave(({ colShape, entity }) => {
  if (entity instanceof alt.Player && isInGame(entity) && colShape.meta.isWaterZone) {
    if (waterZones.some((zone) => zone.isEntityIn(entity))) {
      return;
    }
    entity.gameState.flags.delete(PlayerFlags.InFishingArea);
  }
});
