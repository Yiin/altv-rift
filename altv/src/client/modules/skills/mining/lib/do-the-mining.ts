import alt from "@altv/client";
import { getHeadingInDegrees } from "@/core/utility/math";
import { alignPlayerToOre } from "./align-player-to-ore";
import { setIsMiningOre } from "./is-mining-ore";
import { keepPlayerInPlaceForMiningAction } from "./keep-player-in-place-for-mining-action";
import { performMiningAnimation } from "./perform-mining-animation";
import { getOreHitPos } from "./is-next-to-ore";

const player = alt.Player.local;

export async function doTheMining(ore: alt.VirtualEntity) {
  const oreHitPos = getOreHitPos();

  setIsMiningOre(true);

  const requiredHeading = getHeadingInDegrees(player.pos, oreHitPos) - 4;

  await alignPlayerToOre(requiredHeading);

  try {
    keepPlayerInPlaceForMiningAction(true);
    await performMiningAnimation(ore);
  } finally {
    keepPlayerInPlaceForMiningAction(false);
  }
}
