import alt, { Vector3, VirtualEntity, VirtualEntityGroup } from "alt-server";
import { minutesToMilliseconds } from "date-fns";
import { ServerCall } from "@shared/calls/server";
import * as trees from "@shared/modules/woodcutting/trees";
import IGNORED_TREES from "@shared/modules/woodcutting/trees-to-ignore.json";
import { getLevel } from "@shared/modules/experience/experience-table";
import { getTreeLevel, getTreeLogs, getTreeLogXp } from "@shared/modules/woodcutting/functions";
import { TreeType } from "@shared/modules/woodcutting/interfaces";
import { MessageType } from "@shared/modules/chat";
import { rpc } from "@/rpc";
import { Chat } from "@/modules/chat/chat";
import { sendChatMessage } from "@/modules/chat";

const virtualTreeGroup = new VirtualEntityGroup(30);
const virtualTreeById: Map<number, VirtualEntity> = new Map();
const playerHittingTree: WeakMap<alt.Player, number> = new WeakMap();

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
    refillTree(tree);

    virtualTreeById.set(tree.id, tree);
  }
}

rpc.registerClient(ServerCall.FromClient.BEGIN_TREE_HIT, (player, virtualTreeId) => {
  if (!player.store.isLoggedIn) {
    return 0;
  }

  playerHittingTree.set(player, virtualTreeId);

  const level = getLevel(player.store.character.skills.woodcutting.experience);

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
  if (!player.store.isLoggedIn) {
    return 0;
  }

  const virtualTree = virtualTreeById.get(virtualTreeId);

  if (!virtualTree) {
    console.log("No virtual tree");
    return 0;
  }

  if (playerHittingTree.get(player) !== virtualTreeId) {
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
    chance < 0.05 ? 5 + ~~(Math.random() * 4) : chance < 0.3 ? 1 + ~~(Math.random() * 3) : 0;

  virtualTree.setMeta("capacity", Math.max(0, capacity - logs));

  if (capacity - logs <= 0) {
    virtualTree.setStreamSyncedMeta("cooldownUntil", Date.now() + minutesToMilliseconds(10));
    refillTree(virtualTree);
  }

  const currentLevel = getLevel(player.store.character.skills.woodcutting.experience);

  const experience = logs * getTreeLogXp(treeType);
  player.store.character.skills.woodcutting.experience += experience;

  const newLevel = getLevel(player.store.character.skills.woodcutting.experience);

  if (logs) {
    console.log(
      `Player ${player.name} got ${logs} logs and now has ${player.store.character.skills.woodcutting.experience} woodcutting experience.`
    );
    sendChatMessage(player, `You got ${logs} logs (${experience}xp).`, MessageType.Info);
    if (newLevel > currentLevel) {
      console.log(`${player.name} have reached woodcutting level ${newLevel}!`);
      sendChatMessage(
        player,
        "You have reached woodcutting level " + newLevel + "!",
        MessageType.Success
      );
    }
    player.addItem(getTreeLogs(treeType), { amount: logs }); //
  }

  return logs;
});

function isPlayerNearTree(player: alt.Player, virtualTree: alt.VirtualEntity) {
  return player.pos.distanceTo(virtualTree.pos) < 5;
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

function refillTree(virtualTree: alt.VirtualEntity) {
  virtualTree.setMeta("capacity", ~~(Math.random() * 50) + 100);
}
