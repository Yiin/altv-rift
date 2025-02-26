import alt from "@altv/server";
import { registerCmd, sendChatMessage } from "@/modules/chat";
import { Ore, OreItemKey, createItem, isItemKeyOre } from "@shared/modules/items";
import { NotificationType, VirtualEntityType } from "@shared/interfaces";
import { InGamePlayer, isInGame, needsToBeInGame } from "@/core/utility/assertions";
import { getLevel } from "@shared/modules/experience/experience-table";
import { rpc } from "@/core/rpc";
import { ServerCall } from "@shared/calls/server";
import { MessageType } from "@shared/modules/chat";

const virtualOreGroup = alt.VirtualEntityGroup.create({
  maxEntitiesInStream: 30,
});
export const playerHittingOre: WeakMap<InGamePlayer, number> = new WeakMap();

registerCmd("ore", (player, [type]) => {
  if (!isInGame(player)) {
    return;
  }

  if (!isItemKeyOre(type)) {
    type = Ore.IRON_ORE;
    player.notify(NotificationType.Warning, "Invalid ore type, defaulting to iron ore.");
  }

  const ve = alt.VirtualEntity.create({
    group: virtualOreGroup,
    pos: player.pos,
    streamingDistance: 30,
    data: {
      entityType: VirtualEntityType.Ore,
      oreType: type,
      capacity: ~~(Math.random() * 8) + 8,
    },
  });
});

export function isPlayerNearOre(player: InGamePlayer, virtualOre: alt.VirtualEntity): boolean {
  const dist = new alt.Vector2(player.pos).distanceTo(virtualOre.pos);
  return dist < 5;
}

export function canPlayerHitTheOre(player: InGamePlayer, virtualOre: alt.VirtualEntity): boolean {
  const oreType = virtualOre.streamSyncedMeta.oreType;

  if (!oreType) {
    return false;
  }

  if (getLevel(player.character.skills.mining.exp) < getOreLevel(oreType)) {
    return false;
  }
  return true;
}

function getOreLevel(type: OreItemKey) {
  switch (type) {
    case Ore.IRON_ORE:
      return 1;
    case Ore.IRON_ORE:
      return 10;
    case Ore.SILVER_ORE:
      return 20;
    case Ore.TITANIUM_ORE:
      return 30;
    case Ore.ZINC_ORE:
      return 40;
  }
  return 0;
}

rpc.registerClient(ServerCall.FromClient.BEGIN_ORE_HIT, (player, virtualOreId) => {
  needsToBeInGame(player);

  playerHittingOre.set(player, virtualOreId);

  const level = getLevel(player.character.skills.mining.exp);

  const cooldown = 1500;

  return cooldown;
});

rpc.registerClient(ServerCall.FromClient.ORE_HIT, (player, virtualOreId) => {
  needsToBeInGame(player);

  const virtualOre = alt.VirtualEntity.getByID(virtualOreId);

  if (!virtualOre) {
    alt.log("virtualOre not found");
    return 0;
  }

  if (playerHittingOre.get(player) !== virtualOreId) {
    alt.log("playerHittingOre not found");
    return 0;
  }

  const oreType = virtualOre.streamSyncedMeta.oreType;

  if (!isPlayerNearOre(player, virtualOre)) {
    alt.log("player not near ore");
    return 0;
  }

  const cooldownUntil = virtualOre.streamSyncedMeta.cooldownUntil;

  if (cooldownUntil && cooldownUntil > Date.now()) {
    alt.log("cooldownUntil not expired");
    return 0;
  }

  if (!canPlayerHitTheOre(player, virtualOre)) {
    alt.log("canPlayerHitTheOre not true");
    return 0;
  }

  const rollSuccess = Math.random() < 0.35;

  if (!rollSuccess) {
    return 0;
  }

  const capacity = virtualOre.streamSyncedMeta.capacity;

  if (!capacity) {
    alt.log("capacity zero");
    virtualOre.destroy();
    return 0;
  }

  const ores = Math.min(3, Math.max(Math.max(1, ~~(capacity * 0.2)), ~~(Math.random() * capacity)));

  virtualOre.streamSyncedMeta.capacity = Math.max(0, capacity - ores);

  if (!virtualOre.streamSyncedMeta.capacity) {
    virtualOre.destroy();
  }

  const currentLevel = getLevel(player.character.skills.mining.exp);

  const experience = ores * (getOreLevel(oreType) + 10);
  player.character.skills.mining.exp += experience;

  const newLevel = getLevel(player.character.skills.mining.exp);

  if (ores) {
    player.notify(NotificationType.Success, `You got ${ores} ores (${experience}xp).`);
    if (newLevel > currentLevel) {
      sendChatMessage(
        player,
        "You have reached mining level " + newLevel + "!",
        MessageType.Success,
      );
    }
    player.addItem(createItem(oreType, { amount: ores }), {
      dropOnFail: true,
    });
  }

  return ores;
});
