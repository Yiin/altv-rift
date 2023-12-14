import * as alt from "@altv/server";
import { vec3, quat } from "gl-matrix";
import { minutesToMilliseconds } from "date-fns";
import { ServerCall } from "@shared/calls/server";
import * as trees from "@shared/modules/woodcutting/trees";
import IGNORED_TREES from "@shared/modules/woodcutting/trees-to-ignore.json";
import { getLevel } from "@shared/modules/experience/experience-table";
import { getTreeLevel, getTreeLogs, getTreeLogXp } from "@shared/modules/woodcutting/functions";
import { MessageType } from "@shared/modules/chat";
import { createItem } from "@shared/modules/items";
import { ServerEvents } from "@shared/events/server";
import { rpc } from "@/core/rpc";
import { sendChatMessage } from "@/modules/chat";
import { InGamePlayer, needsToBeInGame } from "@/core/utility/assertions";
import { emit } from "@/core/events/emit";

const virtualTreeGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 30 });

const virtualTreeById: Map<number, alt.VirtualEntity> = new Map();
const playerHittingTree: WeakMap<InGamePlayer, number> = new WeakMap();

console.log("Growing trees...");

let skippedTrees = 0;

for (const type in trees) {
  const list = trees[type as keyof typeof trees];

  for (const { Position, Quaternion } of list) {
    if (
      IGNORED_TREES.some(
        (tree) =>
          tree.pos.x === Position.X &&
          tree.pos.y === Position.Y &&
          tree.pos.z === Position.Z &&
          tree.type === type
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
        treeType: type,
        cooldownUntil: 0,
      },
    });
    refillTree(tree);

    virtualTreeById.set(tree.id, tree);
  }
}

console.log("Trees grown.");
console.log("Skipped trees:", skippedTrees);

function getUpPosition(data: {
  Position: { X: number; Y: number; Z: number };
  Quaternion: { X: number; Y: number; Z: number; W: number };
}): alt.Vector3 {
  // Extract quaternion from the data
  const q = quat.fromValues(
    data.Quaternion.X,
    data.Quaternion.Y,
    data.Quaternion.Z,
    data.Quaternion.W
  );

  // 'up' vector
  const v = vec3.fromValues(0, 0, 1);

  // Rotate the up vector using the given quaternion
  const v_rotated = vec3.transformQuat(vec3.create(), v, q);

  // Scale
  const offset = vec3.scale(vec3.create(), v_rotated, 1);

  // Calculate the final position
  const position = vec3.add(
    vec3.create(),
    vec3.fromValues(data.Position.X, data.Position.Y, data.Position.Z),
    offset
  );

  return new alt.Vector3(position[0], position[1], position[2]);
}

alt.Events.onPlayer("ignoretree", (player, treeId) => {
  const tree = virtualTreeById.get(treeId as number);

  if (!tree) {
    return;
  }

  const treeType = tree.streamSyncedMeta.treeType!;

  const closestMatch = trees[treeType].find((match) => {
    const position = {
      x: match.Position.X,
      y: match.Position.Y,
      z: match.Position.Z + 1.8,
    };

    const dist = new alt.Vector3(position).distanceTo(tree.pos);

    return dist < 1;
  });

  if (closestMatch) {
    const position = {
      x: closestMatch.Position.X,
      y: closestMatch.Position.Y,
      z: closestMatch.Position.Z,
    };
    console.log(
      JSON.stringify({
        pos: position,
        type: treeType,
      })
    );
  }
});

rpc.registerClient(ServerCall.FromClient.BEGIN_TREE_HIT, (player, virtualTreeId) => {
  needsToBeInGame(player);

  playerHittingTree.set(player, virtualTreeId);

  const level = getLevel(player.character.skills.woodcutting);

  const cooldown = Math.max(450, 1000 - (level * 1000) / 120);

  player.playAnimation(
    "melee@hatchet@streamed_core",
    "plyr_front_takedown",
    4,
    4,
    1000,
    0,
    0,
    false,
    false,
    false
  );

  return cooldown;
});

rpc.registerClient(ServerCall.FromClient.TREE_HIT, (player, virtualTreeId) => {
  needsToBeInGame(player);

  const virtualTree = virtualTreeById.get(virtualTreeId);

  if (!virtualTree) {
    console.log("no virtual tree", virtualTreeId);
    return 0;
  }

  if (playerHittingTree.get(player) !== virtualTreeId) {
    console.log("not hitting tree", virtualTreeId);
    return 0;
  }

  const treeType = virtualTree.streamSyncedMeta.treeType;

  if (!isPlayerNearTree(player, virtualTree)) {
    alt.log("Not near tree", treeType, virtualTree.id);
    return 0;
  }

  const cooldownUntil = virtualTree.streamSyncedMeta.cooldownUntil;

  if (cooldownUntil && cooldownUntil > Date.now()) {
    alt.log("On cooldown", treeType, virtualTree.id);
    return 0;
  }

  if (!canPlayerHitTheTree(player, virtualTree)) {
    alt.log("Can't hit tree", treeType, virtualTree.id);
    return 0;
  }
  const capacity = virtualTree.meta.capacity;

  if (!capacity) {
    if (!cooldownUntil || cooldownUntil < Date.now()) {
      virtualTree.streamSyncedMeta.cooldownUntil = Date.now() + minutesToMilliseconds(10);
    }
    return 0;
  }

  const chance = Math.random();

  const logs =
    chance < 0.05 ? 5 + ~~(Math.random() * 4) : chance < 0.3 ? 1 + ~~(Math.random() * 3) : 0;

  virtualTree.meta.capacity = Math.max(0, capacity - logs);

  if (capacity - logs <= 0) {
    virtualTree.streamSyncedMeta.cooldownUntil = Date.now() + minutesToMilliseconds(10);
    refillTree(virtualTree);
  }

  const currentLevel = getLevel(player.character.skills.woodcutting);

  const experience = logs * getTreeLogXp(treeType);
  player.character.skills.woodcutting += experience;

  const newLevel = getLevel(player.character.skills.woodcutting);

  if (logs) {
    sendChatMessage(player, `You got ${logs} logs (${experience}xp).`, MessageType.Info);
    if (newLevel > currentLevel) {
      sendChatMessage(
        player,
        "You have reached woodcutting level " + newLevel + "!",
        MessageType.Success
      );
    }
    player.addItem(createItem(getTreeLogs(treeType), { amount: logs }));
  }

  return logs;
});

function isPlayerNearTree(player: InGamePlayer, virtualTree: alt.VirtualEntity) {
  const dist = new alt.Vector2(player.pos).distanceTo(virtualTree.pos);
  return dist < 5;
}

function canPlayerHitTheTree(player: InGamePlayer, virtualTree: alt.VirtualEntity) {
  const treeType = virtualTree.streamSyncedMeta.treeType;

  if (!treeType) {
    console.log("No tree type", virtualTree.id);
    return false;
  }

  if (getLevel(player.character.skills.woodcutting) < getTreeLevel(treeType)) {
    console.log("Not enough level", virtualTree.id);
    return false;
  }
  return true;
}

function refillTree(virtualTree: alt.VirtualEntity) {
  virtualTree.meta.capacity = ~~(Math.random() * 50) + 100;
}
