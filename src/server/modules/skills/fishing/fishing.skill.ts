import alt from "alt-server";
import { ServerCall } from "@shared/calls/server";
import { PlayerFlags } from "@shared/store/game-state.store";
import { Tools } from "@shared/modules/items/basic/tools";
import { BAIT_TO_FISH_MAP, FishBait } from "@shared/modules/items/basic/fish-bait";
import { createItem } from "@shared/modules/items";
import { rpc } from "@/rpc";
import { isInGame, needsToBeInGame } from "@/utility/assertions";
import { sendChatMessage } from "@/modules/chat";

rpc.registerClient(ServerCall.FromClient.START_FISHING, (player: alt.Player) => {
  needsToBeInGame(player);

  if (!player.hasItem(Tools.FISHING_ROD)) {
    return;
  }

  player.gameState.flags.add(PlayerFlags.IsFishing);
  player.playScenario("WORLD_HUMAN_STAND_FISHING");
});

function fishingTick(player: alt.Player) {
  if (!isInGame(player)) {
    return;
  }

  if (!player.gameState.flags.has(PlayerFlags.IsFishing)) {
    return;
  }

  const shouldUseBait = Math.random() < 0.2;

  if (shouldUseBait && player.hasItem(FishBait.WORMS)) {
    player.removeInventoryItemByKey(FishBait.WORMS, 1);
    if (Math.random() < 0.5) {
      const fish = BAIT_TO_FISH_MAP.get(FishBait.WORMS)!.at(0)!;

      sendChatMessage(player, `You caught a ${fish}!`);

      player.addItem(createItem(fish, { amount: 1 }));
    } else {
      sendChatMessage(player, `You the fish escaped...`);
    }
  }
}

alt.setInterval(() => {
  alt.Player.all.forEach(fishingTick);
}, 1000);

rpc.registerClient(ServerCall.FromClient.STOP_FISHING, (player: alt.Player) => {
  needsToBeInGame(player);

  player.gameState.flags.delete(PlayerFlags.IsFishing);
  player.clearTasks();

  player.applyEquipment();
});
