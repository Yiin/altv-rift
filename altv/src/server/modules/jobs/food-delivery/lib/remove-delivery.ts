import { InGamePlayer } from "@/core/utility/assertions";
import { PlayerDelivery } from "@shared/store/game-state.store";

export function removeDelivery(player: InGamePlayer, delivery: PlayerDelivery): void {
  player.gameState.foodDelivery.activeDeliveries.splice(player.gameState.foodDelivery.activeDeliveries.findIndex((d) => d.id === delivery.id), 1);
}
