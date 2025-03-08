import { InGamePlayer } from "@/core/utility/assertions";
import { DeliveryRewardType } from "@shared/enums/delivery-reward-type";
import { getLevel } from "@shared/modules/experience/experience-table";
import { PlayerDelivery } from "@shared/store/game-state.store";

export function calculateDeliveryReward(
  player: InGamePlayer,
  deliveryData: PlayerDelivery,
  deliveryTime: number,
): {
  amount: number;
  tip: number;
  type: DeliveryRewardType;
} {
  const baseReward = 100; // Base reward amount - adjust as needed
  let timeBonus = 1.0;
  let type: DeliveryRewardType = DeliveryRewardType.ON_TIME;

  // Get player's food delivery level
  const foodDeliveryLevel = getLevel(player.character.skills.foodDelivery.exp);

  // Calculate level-based scaling factor (1.0 at level 1, 5.0 at level 99)
  const levelScaleFactor = 1.0 + (4.0 * Math.min(foodDeliveryLevel - 1, 98) / 98);

  // Base tip chances at level 1
  const baseTipChanceVeryFast = 0.25; // 25% chance for very fast deliveries
  const baseTipChanceFast = 0.15;     // 15% chance for fast deliveries

  // Base tip bonuses at level 1
  const baseTipBonusVeryFast = 0.25;  // 25% bonus (1.25x multiplier)
  const baseTipBonusFast = 0.15;      // 15% bonus (1.15x multiplier)

  // Scale chances and bonuses based on level
  const tipChanceVeryFast = Math.min(baseTipChanceVeryFast * levelScaleFactor, 1.0); // Cap at 100%
  const tipChanceFast = Math.min(baseTipChanceFast * levelScaleFactor, 1.0); // Cap at 100%
  const tipBonusVeryFast = baseTipBonusVeryFast * levelScaleFactor;
  const tipBonusFast = baseTipBonusFast * levelScaleFactor;

  // Calculate time bonus/penalty based on delivery time compared to time limit
  if (deliveryTime <= deliveryData.timeLimit * 0.6) {
    // Very quick delivery (under 60% of time limit) - level-based chance of tip
    const gotTip = Math.random() < tipChanceVeryFast;
    timeBonus = gotTip ? 1.0 + tipBonusVeryFast : 1.0;
    type = DeliveryRewardType.VERY_FAST;
  } else if (deliveryTime <= deliveryData.timeLimit * 0.8) {
    // Fast delivery (under 80% of time limit) - level-based chance of tip
    const gotTip = Math.random() < tipChanceFast;
    timeBonus = gotTip ? 1.0 + tipBonusFast : 1.0;
    type = DeliveryRewardType.FAST;
  } else if (deliveryTime > deliveryData.timeLimit * 2) {
    // Very late delivery (over 220% of time limit) - significant penalty
    timeBonus = 0.5;
    type = DeliveryRewardType.VERY_LATE;
  } else if (deliveryTime > deliveryData.timeLimit) {
    // Late delivery (over time limit) - small penalty
    timeBonus = 0.75;
    type = DeliveryRewardType.LATE;
  }

  // Calculate final reward with bonuses
  const baseRewardWithBonus = baseReward * deliveryData.bonus;
  const reward = Math.round(baseRewardWithBonus * timeBonus);

  // Calculate tip based on the rounded final reward
  const tip = Math.round(reward - baseRewardWithBonus);

  // Log the level-based scaling for debugging
  if (timeBonus > 1.0) {
    console.log(
      `[FoodDelivery-Server] Level ${foodDeliveryLevel} bonus: ${levelScaleFactor.toFixed(2)}x scaling, ${timeBonus.toFixed(2)}x tip multiplier`
    );
  }

  return { amount: reward, tip, type };
}
