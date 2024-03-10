import alt from "@altv/server";
import { PlayerFlags } from "@shared/store/game-state.store";
import { isInGame } from "@/core/utility/assertions";
import WATER_ZONES from "./water-zones.json" assert { type: 'json' };

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

  colshape.meta.isWaterZone = true;
  return colshape;
});

export function getWaterZones() {
  return waterZones;
}

alt.Events.onEntityColShapeEnter(({ colShape, entity }) => {
  if (entity instanceof alt.Player && isInGame(entity) && colShape.meta.isWaterZone) {
    if (entity.gameState.flags.has(PlayerFlags.InFishingArea)) {
      return;
    }
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
