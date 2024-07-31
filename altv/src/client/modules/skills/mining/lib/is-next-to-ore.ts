import alt from "@altv/client";
import { getClosest } from "@shared/utility/vector";
import { getMiningOre, setMiningOre } from "./current-mining-ore";
import { getNearbyOres } from "./get-nearby-ores";

let oreHitPos: alt.Vector3;

export function isNextToOre() {
  const nearbyOres = getNearbyOres({ distance: 5 });

  const ore = getClosest(alt.Player.local.pos, nearbyOres);
  if (ore) {
    const distance = alt.Player.local.pos.distanceTo(ore.pos);

    if (distance < 2.5) {
      setMiningOre(ore);
      oreHitPos = ore.pos;
      return true;
    }
  }

  setMiningOre(null);

  return false;
}

export function getOreHitPos() {
  if (!getMiningOre()) {
    throw new Error("No nearby ore to hit");
  }
  return oreHitPos;
}
