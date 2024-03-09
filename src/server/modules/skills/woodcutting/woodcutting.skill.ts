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

const virtualTreeGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 30 });

const virtualTreeById: Map<number, alt.VirtualEntity> = new Map();
const playerHittingTree: WeakMap<InGamePlayer, number> = new WeakMap();

async function growTrees() {
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
          treeType: type as keyof typeof trees,
          cooldownUntil: 0,
        },
      });
      refillTree(tree);

      virtualTreeById.set(tree.id, tree);
      validTrees++;
    }
    await alt.Utils.waitForNextTick();
  }
}

growTrees();

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

    IGNORED_TREES.push({ pos: position, type: treeType });

    // save to file as well
    fs.writeFileSync(
      path.join(__dirname, "../../src/shared/modules/woodcutting/trees-to-ignore.json"),
      JSON.stringify(IGNORED_TREES, null, 2)
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
    return 0;
  }

  if (playerHittingTree.get(player) !== virtualTreeId) {
    return 0;
  }

  const treeType = virtualTree.streamSyncedMeta.treeType;

  if (!isPlayerNearTree(player, virtualTree)) {
    return 0;
  }

  const cooldownUntil = virtualTree.streamSyncedMeta.cooldownUntil;

  if (cooldownUntil && cooldownUntil > Date.now()) {
    return 0;
  }

  if (!canPlayerHitTheTree(player, virtualTree)) {
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
    return false;
  }

  if (getLevel(player.character.skills.woodcutting) < getTreeLevel(treeType)) {
    return false;
  }
  return true;
}

function refillTree(virtualTree: alt.VirtualEntity) {
  virtualTree.meta.capacity = ~~(Math.random() * 50) + 100;
}
