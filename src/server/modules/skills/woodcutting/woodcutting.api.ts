import fs from "fs";
import path from "path";
import alt from "@altv/server";
import { minutesToMilliseconds } from "date-fns";
import { ServerCall } from "@shared/calls/server";
import * as trees from "@shared/modules/woodcutting/trees";
import IGNORED_TREES from "@shared/modules/woodcutting/trees-to-ignore.json";
import { getLevel } from "@shared/modules/experience/experience-table";
import { getTreeLevel, getTreeLogs, getTreeLogXp } from "@shared/modules/woodcutting/functions";
import { MessageType } from "@shared/modules/chat";
import { createItem } from "@shared/modules/items";
import { rpc } from "@/core/rpc";
import { sendChatMessage } from "@/modules/chat";
import { InGamePlayer, needsToBeInGame } from "@/core/utility/assertions";

export const virtualTreeGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 30 });
export const playerHittingTree: WeakMap<InGamePlayer, number> = new WeakMap();

export async function growTrees() {
  let skippedTrees = 0;
  let validTrees = 0;

  for (const type in trees) {
    const list = trees[type as keyof typeof trees];

    for (const { Position, Quaternion } of list) {
      if (
        IGNORED_TREES.some(
          (tree) =>
            tree.pos.x === Position.X &&
            tree.pos.y === Position.Y &&
            tree.pos.z === Position.Z &&
            tree.type === type,
        )
      ) {
        skippedTrees++;
        continue;
      }
      const position = {
        x: Position.X,
        y: Position.Y,
        z: Position.Z + 1.4,
      };
      //getUpPosition({ Position, Quaternion });

      const tree = alt.VirtualEntity.create({
        group: virtualTreeGroup,
        pos: new alt.Vector3(position),
        streamingDistance: 30,
        data: {
          entityType: "tree",
          treeType: type as keyof typeof trees,
          cooldownUntil: 0,
        },
      });
      refillTree(tree);

      validTrees++;
    }
    await alt.Utils.waitForNextTick();
  }
}

export function isPlayerNearTree(player: InGamePlayer, virtualTree: alt.VirtualEntity) {
  const dist = new alt.Vector2(player.pos).distanceTo(virtualTree.pos);
  return dist < 5;
}

export function canPlayerHitTheTree(player: InGamePlayer, virtualTree: alt.VirtualEntity) {
  const treeType = virtualTree.streamSyncedMeta.treeType;

  if (!treeType) {
    return false;
  }

  if (getLevel(player.character.skills.woodcutting) < getTreeLevel(treeType)) {
    return false;
  }
  return true;
}

export function refillTree(virtualTree: alt.VirtualEntity) {
  virtualTree.meta.capacity = ~~(Math.random() * 50) + 100;
}
