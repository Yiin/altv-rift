import alt from "@altv/server";
import { PlayerFlags } from "@shared/store/game-state.store";
import { isInGame } from "@/core/utility/assertions";

declare module "@altv/server" {
  interface ICustomColshapeMeta {
    isDiggingZone?: boolean;
  }
}

const DIGGING_ZONES: any[] = [
  { x: 4747.552734375, y: -4489.9365234375, z: 14.253127098083496, radius: 20 },
  { x: 5316.13427734375, y: -5370.37890625, z: 44.7873649597168, radius: 20 },
  { x: 5270.93017578125, y: -5376.875, z: 54.389320373535156, radius: 15 },
];

const diggingZones = DIGGING_ZONES.map((zone) => {
  const colshape = alt.ColShapeCircle.create({
    pos: { x: zone.x, y: zone.y },
    radius: zone.radius,
  });

  colshape.meta.isDiggingZone = true;
  return colshape;
});

export function getDiggingZones() {
  return diggingZones;
}

alt.Events.onEntityColShapeEnter(({ colShape, entity }) => {
  if (entity instanceof alt.Player && isInGame(entity) && colShape.meta.isDiggingZone) {
    if (entity.gameState.flags.has(PlayerFlags.InDiggingArea)) {
      return;
    }
    entity.gameState.flags.add(PlayerFlags.InDiggingArea);
  }
});

alt.Events.onEntityColShapeLeave(({ colShape, entity }) => {
  if (entity instanceof alt.Player && isInGame(entity) && colShape.meta.isDiggingZone) {
    if (diggingZones.some((zone) => zone.isEntityIn(entity))) {
      return;
    }
    entity.gameState.flags.delete(PlayerFlags.InDiggingArea);
  }
});
