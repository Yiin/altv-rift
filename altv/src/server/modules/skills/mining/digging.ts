import alt from "@altv/server";
import { ServerCall } from "@shared/calls/server";
import { PlayerFlags } from "@shared/store/game-state.store";
import { Sand, createItem } from "@shared/modules/items";
import { rpc } from "@/core/rpc";
import { isInGame, needsToBeInGame } from "@/core/utility/assertions";

rpc.registerClient(ServerCall.FromClient.START_DIGGING, (player: alt.Player) => {
  needsToBeInGame(player);

  player.gameState.flags.add(PlayerFlags.IsDigging);
  player.playScenario("WORLD_HUMAN_GARDENER_PLANT");
});

function diggingTick(player: alt.Player) {
  if (!isInGame(player)) {
    return;
  }

  if (!player.gameState.flags.has(PlayerFlags.IsDigging)) {
    return;
  }

  const luckFactor = Math.random() < 0.5 ? 1 : 2;

  player.character.skills.mining += 3 * luckFactor;

  player.addItem(createItem(Sand.GRAVEL, { amount: 1 * luckFactor }), {
    dropOnFail: true,
  });
}

function stopDigging(player: alt.Player) {
  needsToBeInGame(player);

  player.gameState.flags.delete(PlayerFlags.IsDigging);

  player.applyEquipment();
}

alt.Timers.setInterval(() => {
  alt.Player.all.forEach(diggingTick);
}, 1000);

rpc.registerClient(ServerCall.FromClient.STOP_DIGGING, stopDigging);
