import alt from "@altv/server";
import * as trees from "@shared/modules/woodcutting/trees";
import { getLevel } from "@shared/modules/experience/experience-table";
import { getTreeLevel } from "@shared/modules/woodcutting/lib";
import { VirtualEntityType } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";

export const virtualTreeGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 30 });
export const playerHittingTree: WeakMap<InGamePlayer, number> = new WeakMap();

export async function growTrees(): Promise<void> {
  let validTrees = 0;

  const WAIT_EVERY = 1000;

  for (const type in trees) {
    const list = trees[type as keyof typeof trees];

    for (const pos of list) {
      pos.z += 1.4;

      const tree = alt.VirtualEntity.create({
        group: virtualTreeGroup,
        pos: new alt.Vector3(pos),
        streamingDistance: 30,
        data: {
          entityType: VirtualEntityType.Tree,
          treeType: type as keyof typeof trees,
          cooldownUntil: 0,
        },
      });
      refillTree(tree);

      validTrees++;

      if (validTrees % WAIT_EVERY === 0) {
        await alt.Utils.waitForNextTick();
      }
    }
  }

  console.log("Trees:", validTrees);
}

export function isPlayerNearTree(player: InGamePlayer, virtualTree: alt.VirtualEntity): boolean {
  const dist = new alt.Vector2(player.pos).distanceTo(virtualTree.pos);
  return dist < 5;
}

export function canPlayerHitTheTree(player: InGamePlayer, virtualTree: alt.VirtualEntity): boolean {
  const treeType = virtualTree.streamSyncedMeta.treeType;

  if (!treeType) {
    return false;
  }

  if (getLevel(player.character.skills.woodcutting) < getTreeLevel(treeType)) {
    return false;
  }
  return true;
}

export function refillTree(virtualTree: alt.VirtualEntity): void {
  virtualTree.meta.capacity = ~~(Math.random() * 50) + 100;
}
