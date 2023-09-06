import alt from "alt-client";
import { getHeadingInDegrees } from "@/utility/math";
import { alignPlayerToTree } from "./align-player-to-tree";
import { setIsChoppingTree } from "./is-chopping-tree";
import { keepPlayerInPlace } from "./keep-player-in-place";
import { performChopAnimation } from "./perform-chop-animation";
import { getTreeHitPos } from "./is-next-to-tree";

const player = alt.Player.local;

export async function doTheChopping(tree: alt.VirtualEntity) {
  const treeHitPos = getTreeHitPos();

  setIsChoppingTree(true);

  const requiredHeading = getHeadingInDegrees(player.pos, treeHitPos) - 4;

  await alignPlayerToTree(player.scriptID, requiredHeading);

  try {
    keepPlayerInPlace(true);
    await performChopAnimation(tree);
  } finally {
    keepPlayerInPlace(false);
  }
}
