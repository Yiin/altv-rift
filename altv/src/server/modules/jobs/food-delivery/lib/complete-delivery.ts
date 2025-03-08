import alt from "@altv/server";
import { InGamePlayer } from "@/core/utility/assertions";
import { DeliveryRewardType } from "@shared/enums/delivery-reward-type";
import { NotificationType } from "@shared/interfaces";
import { PlayerDelivery } from "@shared/store/game-state.store";
import { updateDeliveryStats } from "./update-delivery-stats";
import { calculateDeliveryReward } from "./calculate-delivery-reward";
import { removeDelivery } from "./remove-delivery";
import { getDeliveryPointPosition } from "@shared/modules/jobs/food-delivery";

// Function to complete a specific delivery and give rewards
export function completeDelivery(player: InGamePlayer, delivery: PlayerDelivery) {
  console.log(
    `[FoodDelivery-Server] Completing delivery for player ${player.id}, deliveryId: ${delivery.id}`,
  );

  // Calculate time taken and rewards
  const timeTaken = Date.now() - delivery.startTime;
  const distance = new alt.Vector3(delivery.collectionPoint).distanceTo(getDeliveryPointPosition(delivery));
  console.log(`[FoodDelivery-Server] Time taken for delivery: ${timeTaken}ms`);
  const { amount: reward, tip, type: deliveryRewardType } = calculateDeliveryReward(player, delivery, timeTaken);
  const distanceExpBonus = Math.round(distance / 20);
  const rewardExpBonus = Math.round(reward / 10);
  const expGain = distanceExpBonus + rewardExpBonus;
  console.log(`[FoodDelivery-Server] Calculated reward: ${reward}, exp gain - for distance: ${distanceExpBonus}, for reward: ${rewardExpBonus}`);

  // Remove the completed delivery
  removeDelivery(player, delivery);

  // Add money
  player.character.money += reward;

  // Add experience
  player.character.skills.foodDelivery.exp += expGain;

  // Determine if this was a fast delivery that received a tip
  const gotTip = tip > 0;

  // Update stats
  updateDeliveryStats(player, delivery, timeTaken, reward, gotTip);

  // Show completion notification with appropriate message based on timing
  switch (deliveryRewardType) {
    case DeliveryRewardType.VERY_FAST:
      if (gotTip) {
        player.notify(
          NotificationType.Success,
          `Lightning fast delivery! Customer tipped you extra. Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      } else {
        player.notify(
          NotificationType.Success,
          `Lightning fast delivery! Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      }
      break;
    case DeliveryRewardType.FAST:
      if (gotTip) {
        player.notify(
          NotificationType.Success,
          `Fast delivery! Customer tipped you extra. Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      } else {
        player.notify(
          NotificationType.Success,
          `Fast delivery! Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      }
      break;
    case DeliveryRewardType.ON_TIME:
      if (gotTip) {
        player.notify(
          NotificationType.Success,
          `Delivery completed on time. Customer tipped you extra. Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      } else {
        player.notify(
          NotificationType.Success,
          `Delivery completed on time. Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      }
      break;
    case DeliveryRewardType.LATE:
      if (gotTip) {
        player.notify(
          NotificationType.Warning,
          `Late delivery! Customer tipped you extra. Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      } else {
        player.notify(
          NotificationType.Warning,
          `Late delivery! Received reduced payment of $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete" },
        );
      }
      break;
    case DeliveryRewardType.VERY_LATE:
      if (gotTip) {
        player.notify(
          NotificationType.Error,
          `Very late delivery! Customer tipped you extra. Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      } else {
        player.notify(
          NotificationType.Error,
          `Very late delivery! Received reduced payment of $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete" },
        );
      }
      break;
  }

  return { reward, tip, exp: expGain, type: deliveryRewardType };
}