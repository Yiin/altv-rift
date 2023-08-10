import alt, { Vector3, VirtualEntity, VirtualEntityGroup } from "alt-server";
import { minutesToMilliseconds } from "date-fns";
import { ServerCall } from "@shared/calls/server";
import * as trees from "@shared/modules/woodcutting/trees";
import IGNORED_TREES from "@shared/modules/woodcutting/trees/trees-to-ignore.json";
import { getLevel } from "@shared/modules/experience/experience-table";
import { getTreeLevel, getTreeLogs } from "@shared/modules/woodcutting";
import { TreeType } from "@shared/modules/woodcutting/interfaces";
import { rpc } from "@/rpc";

const virtualTreeGroup = new VirtualEntityGroup(30);
const virtualTreeById: Map<number, VirtualEntity> = new Map();

for (const [type, list] of Object.entries(trees)) {
  for (const { Position } of list) {
    if (
      IGNORED_TREES.some(
        (tree) =>
          tree.pos.x === Position.X &&
          tree.pos.y === Position.Y &&
          tree.pos.z === Position.Z &&
          tree.type === type
      )
    ) {
      continue;
    }
    const position = {
      x: Position.X,
      y: Position.Y,
      z: Position.Z + 1.8,
    };

    const tree = new alt.VirtualEntity(virtualTreeGroup, new Vector3(position), 20, {
      entityType: "tree",
      treeType: type,
      cooldownUntil: 0,
    });
    tree.setMeta("capacity", getTreeLevel(type as TreeType) * 10);

    virtualTreeById.set(tree.id, tree);
  }
}

rpc.registerClient(ServerCall.FromClient.TREE_HIT, (player, virtualTreeId) => {
  if (!player.store.isLoggedIn) {
    return 0;
  }

  const virtualTree = virtualTreeById.get(virtualTreeId);

  if (!virtualTree) {
    console.log("No virtual tree");
    return 0;
  }

  const treeType = virtualTree.getStreamSyncedMeta("treeType");

  if (!isPlayerNearTree(player, virtualTree)) {
    console.log("Not near tree", treeType, virtualTree.id);
    return 0;
  }

  const cooldownUntil = virtualTree.getStreamSyncedMeta("cooldownUntil");

  if (cooldownUntil && cooldownUntil > Date.now()) {
    console.log("Cooldown", treeType, virtualTree.id);
    return 0;
  }

  if (!canPlayerHitTheTree(player, virtualTree)) {
    return 0;
  }
  const capacity = virtualTree.getMeta("capacity");

  if (!capacity) {
    if (!cooldownUntil || cooldownUntil < Date.now()) {
      virtualTree.setStreamSyncedMeta("cooldownUntil", Date.now() + minutesToMilliseconds(10));
    }
    console.log("No capacity", virtualTree.id);
    return 0;
  }

  const chance = Math.random();

  const logs =
    chance < 0.05 ? 5 + ~~(Math.random() * 4) : chance < 0.2 ? 1 + ~~(Math.random() * 3) : 0;

  virtualTree.setMeta("capacity", Math.max(0, capacity - logs));

  if (capacity - logs <= 0) {
    virtualTree.setStreamSyncedMeta("cooldownUntil", Date.now() + minutesToMilliseconds(10));
  }

  player.store.character.skills.woodcutting.experience += logs * getTreeLevel(treeType) ** 2;

  if (logs) {
    console.log(
      `Player ${player.name} got ${logs} logs and now has ${player.store.character.skills.woodcutting.experience} woodcutting experience.`
    );
    player.addItem(getTreeLogs(treeType), { amount: logs });
  }

  return logs;
});

function isPlayerNearTree(player: alt.Player, virtualTree: alt.VirtualEntity) {
  return player.pos.distanceTo(virtualTree.pos) < 3;
}

function canPlayerHitTheTree(player: alt.Player, virtualTree: alt.VirtualEntity) {
  if (!player.store.isLoggedIn) {
    return false;
  }
  if (!player.store.character) {
    return false;
  }
  const treeType = virtualTree.getStreamSyncedMeta("treeType");

  if (!treeType) {
    console.log("No tree type", virtualTree.id);
    return false;
  }

  if (getLevel(player.store.character.skills.woodcutting.experience) < getTreeLevel(treeType)) {
    console.log("Not enough level", virtualTree.id);
    return false;
  }
  return true;
}
