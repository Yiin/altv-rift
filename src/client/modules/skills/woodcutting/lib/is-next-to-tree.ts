import * as alt from "@altv/client";
import { getClosest } from "@shared/utility/vector";
import { getChoppingTree, setChoppingTree } from "./current-chopping-tree";
import { getNearbyTrees } from "./get-nearby-trees";
import { raycastTreeEdge } from "./raycast-tree-edge";

let treeHitPos: alt.Vector3;

export function isNextToTree() {
  const nearbyTrees = getNearbyTrees({ distance: 5 });

  const tree = getClosest(alt.Player.local.pos, nearbyTrees);
  if (tree) {
    const hitPos = raycastTreeEdge(alt.Player.local.pos, tree.pos, 0.2);

    if (hitPos) {
      const distance = alt.Player.local.pos.add(0, 0, 0.7).distanceTo(hitPos);

      if (distance < 1.3) {
        setChoppingTree(tree);
        treeHitPos = hitPos;
        return true;
      }
    }
  }

  setChoppingTree(null);

  return false;
}

export function getTreeHitPos() {
  if (!getChoppingTree()) {
    throw new Error("No nearby tree to hit");
  }
  return treeHitPos;
}
