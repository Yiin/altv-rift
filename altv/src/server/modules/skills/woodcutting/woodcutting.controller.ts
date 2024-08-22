import alt from "@altv/server";
import { minutesToMilliseconds } from "date-fns";
import { ServerCall } from "@shared/calls/server";
import { getLevel } from "@shared/modules/experience/experience-table";
import { createItem, TreeLogs } from "@shared/modules/items";
import { getTreeGrade, getTreeLogXp } from "@shared/modules/woodcutting";
import { EquipmentSlot } from "@shared/interfaces";
import { MessageType } from "@shared/modules/chat";
import { sendChatMessage } from "@/modules/chat";
import { needsToBeInGame } from "@/core/utility/assertions";
import { rpc } from "@/core/rpc";
import {
  playerHittingTree,
  isPlayerNearTree,
  canPlayerHitTheTree,
  refillTree,
} from "./woodcutting.api";

rpc.registerClient(ServerCall.FromClient.BEGIN_TREE_HIT, (player, virtualTreeId) => {
  needsToBeInGame(player);

  playerHittingTree.set(player, virtualTreeId);

  const level = getLevel(player.character.skills.woodcutting);

  const cooldown = Math.max(450, 1000 - (level * 1000) / 120);

  player.giveWeapon("WEAPON_HATCHET", 1, true);

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
    false,
  );

  return cooldown;
});

rpc.registerClient(ServerCall.FromClient.TREE_HIT, (player, virtualTreeId) => {
  needsToBeInGame(player);

  player.removeWeapon("WEAPON_HATCHET");
  player.applyEquipment(EquipmentSlot.Weapon);

  const virtualTree = alt.VirtualEntity.getByID(virtualTreeId);

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
        MessageType.Success,
      );
    }
    player.addItem(createItem(TreeLogs.PALM_LOGS, { amount: logs, grade: getTreeGrade(treeType) }));
  }

  return logs;
});
