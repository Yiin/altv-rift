import { InGamePlayer } from "@/core/utility/assertions";
import { PlayerDelivery } from "@shared/store/game-state.store";

// Update stats tracking function to use metadata
export function updateDeliveryStats(
  player: InGamePlayer,
  delivery: PlayerDelivery,
  timeTaken: number,
  reward: number,
  gotTip: boolean,
) {
  const stats = player.character.skills.foodDelivery.stats;

  // Update counters
  stats.totalDeliveries++;
  stats.successfulDeliveries++;
  stats.totalEarnings += reward;

  if (gotTip) stats.tipsReceived++;
  if (delivery.isPrivateHome) stats.privateHomeDeliveries++;
  else stats.regularDeliveries++;

  // Update timing stats
  if (stats.fastestDelivery === 0 || timeTaken < stats.fastestDelivery) {
    stats.fastestDelivery = timeTaken;
  }

  // Update average (rolling calculation)
  const prevTotal = stats.averageDeliveryTime * (stats.successfulDeliveries - 1);
  stats.averageDeliveryTime = (prevTotal + timeTaken) / stats.successfulDeliveries;

  // Update last delivery timestamp
  stats.lastDeliveryDate = Date.now();
}
