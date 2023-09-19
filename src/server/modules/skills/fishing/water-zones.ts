import alt from "alt-server";
import { PlayerFlags } from "@shared/store/game-state.store";
import { isInGame } from "@/utility/assertions";
import WATER_ZONES from "./water-zones.json";

declare module "alt-server" {
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
  const colshape = new alt.ColshapeCircle(zone.x, zone.y, zone.radius);
  colshape.setMeta("isWaterZone", true);
  return colshape;
});

export function getWaterZones() {
  return waterZones;
}

alt.on("entityEnterColshape", (colshape, entity) => {
  if (entity instanceof alt.Player && isInGame(entity) && colshape.getMeta("isWaterZone")) {
    entity.gameState.flags.add(PlayerFlags.InFishingArea);
  }
});

alt.on("entityLeaveColshape", (colshape, entity) => {
  if (entity instanceof alt.Player && isInGame(entity) && colshape.getMeta("isWaterZone")) {
    if (waterZones.some((zone) => zone.isEntityIn(entity))) {
      return;
    }
    entity.gameState.flags.delete(PlayerFlags.InFishingArea);
  }
});
