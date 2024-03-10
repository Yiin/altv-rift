
import alt from "@altv/server";
import { EquipmentSlot } from "@shared/interfaces";
import { isItemFishingRod, BAIT_TO_FISH_MAP, createItem, getItemName } from "@shared/modules/items";
import { PlayerFlags } from "@shared/store/game-state.store";
import { sendChatMessage } from "@/modules/chat";
import { isInGame } from "@/core/utility/assertions";
import { startCatchingFish, stopFishing } from "./api";

alt.Timers.setInterval(() => {
  alt.Player.all.forEach(fishingTick);
}, 1000);

function fishingTick(player: alt.Player) {
  if (!isInGame(player)) {
    return;
  }

  if (!player.gameState.flags.has(PlayerFlags.IsFishing)) {
    // Player is not fishing
    return;
  }

  if (player.gameState.flags.has(PlayerFlags.IsCatchingAFish)) {
    // Player is already catching a fish
    return;
  }

  const fishingRod = player.getEquipedItemInSlot(EquipmentSlot.Tool);

  if (!fishingRod || !isItemFishingRod(fishingRod) || !fishingRod.bait) {
    // Player either unequipped the fishing rod or ran out of bait
    stopFishing(player);
    return;
  }

  // 10% chance to catch a fish
  // TODO: Make it so that the chance is based on the player's fishing skill
  const shouldUseBait = true; //Math.random() < 0.1;

  if (shouldUseBait) {
    const usedBait = fishingRod.bait;

    fishingRod.bait.amount--;

    // Player ran out of bait
    if (fishingRod.bait.amount < 0) {
      fishingRod.bait = null;
      stopFishing(player);
      return;
    } else if (fishingRod.bait.amount === 0) {
      fishingRod.bait = null;
    }

    startCatchingFish(player, usedBait.key);
  }
}