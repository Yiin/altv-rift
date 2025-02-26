import alt from "@altv/server";
import { EquipmentSlot } from "@shared/interfaces";
import { getBaitChance, isItemFishingRod } from "@shared/modules/items";
import { PlayerFlags } from "@shared/store/game-state.store";
import { getLevel } from "@shared/modules/experience/experience-table";
import { isInGame } from "@/core/utility/assertions";
import { startCatchingFish, stopFishing } from "./fishing.api";

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

  const fishingRod = player.getEquipedItemInSlot(EquipmentSlot.Weapon);

  if (!fishingRod || !isItemFishingRod(fishingRod) || !fishingRod.bait) {
    // Player either unequipped the fishing rod or ran out of bait
    stopFishing(player);
    return;
  }

  // Chance is based on the player's fishing skill
  const level = getLevel(player.character.skills.fishing.exp);
  const baitChance = getBaitChance(fishingRod.bait.key);

  // Apply diminishing returns to level bonus
  // This creates a curve that grows more slowly as level increases
  const levelBonus = level / (10 + level / 5);
  const shouldUseBait = Math.random() < (baitChance / 10) * (1 + levelBonus);

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
