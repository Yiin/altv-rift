import alt from "@altv/server";
import { InGamePlayer } from "@/core/utility/assertions";
import { DeliveryRewardType } from "@shared/enums/delivery-reward-type";
import { getLevel } from "@shared/modules/experience/experience-table";
import { PlayerDelivery } from "@shared/store/game-state.store";
import { getDeliveryPointPosition } from "@shared/modules/jobs/food-delivery";

// Constants for reward calculation
const BASE_REWARD_MIN = 80;
const BASE_REWARD_MAX = 120;

// Constants for time bonus thresholds
const VERY_FAST_TIME_THRESHOLD = 0.6; // 60% of time limit
const FAST_TIME_THRESHOLD = 0.8;      // 80% of time limit
const VERY_LATE_TIME_THRESHOLD = 2.0;  // 200% of time limit

// Constants for distance bonus calculation
const DISTANCE_BONUS_THRESHOLD = 1000; // meters
const DISTANCE_BONUS_SEGMENT = 200;    // meters per segment
const DISTANCE_BONUS_PER_SEGMENT = 10; // dollars per segment

// Base tip chances and bonuses at level 1
const BASE_TIP = {
  VERY_FAST: { CHANCE: 0.25, BONUS: 0.25 }, // 25% chance, 25% bonus (1.25x)
  FAST: { CHANCE: 0.15, BONUS: 0.15 }       // 15% chance, 15% bonus (1.15x)
};

export function calculateDeliveryReward(
  player: InGamePlayer,
  delivery: PlayerDelivery,
  deliveryTime: number,
): {
  amount: number;
  tip: number;
  type: DeliveryRewardType;
} {
  const baseReward = BASE_REWARD_MIN + Math.random() * (BASE_REWARD_MAX - BASE_REWARD_MIN);

  // Get player's food delivery level and calculate level-based scaling
  const foodDeliveryLevel = getLevel(player.character.skills.foodDelivery.exp);
  const levelScaleFactor = 1.0 + (4.0 * Math.min(foodDeliveryLevel - 1, 98) / 98);

  // Determine time bonus and delivery type
  let timeBonus = 1.0;
  let type = DeliveryRewardType.ON_TIME;

  const timeRatio = deliveryTime / delivery.timeLimit;

  // Calculate time bonus/penalty based on delivery time compared to time limit
  if (timeRatio <= VERY_FAST_TIME_THRESHOLD) {
    // Very quick delivery - level-based chance of tip
    const tipChance = Math.min(BASE_TIP.VERY_FAST.CHANCE * levelScaleFactor, 1.0);
    timeBonus = Math.random() < tipChance ? 1.0 + (BASE_TIP.VERY_FAST.BONUS * levelScaleFactor) : 1.0;
    type = DeliveryRewardType.VERY_FAST;
  } else if (timeRatio <= FAST_TIME_THRESHOLD) {
    // Fast delivery - level-based chance of tip
    const tipChance = Math.min(BASE_TIP.FAST.CHANCE * levelScaleFactor, 1.0);
    timeBonus = Math.random() < tipChance ? 1.0 + (BASE_TIP.FAST.BONUS * levelScaleFactor) : 1.0;
    type = DeliveryRewardType.FAST;
  } else if (timeRatio > VERY_LATE_TIME_THRESHOLD) {
    // Very late delivery - significant penalty
    timeBonus = 0.5;
    type = DeliveryRewardType.VERY_LATE;
  } else if (timeRatio > 1.0) {
    // Late delivery - small penalty
    timeBonus = 0.75;
    type = DeliveryRewardType.LATE;
  }

  // Calculate distance bonus
  const distance = new alt.Vector3(delivery.collectionPoint).distanceTo(getDeliveryPointPosition(delivery));
  const distanceBonus = calculateDistanceBonus(distance);

  // Calculate final reward with bonuses
  const baseRewardWithBonus = baseReward * delivery.bonus;
  const rewardWithTimeBonus = baseRewardWithBonus * timeBonus;
  const reward = Math.round(rewardWithTimeBonus + distanceBonus);
  const tip = Math.round(rewardWithTimeBonus - baseRewardWithBonus);

  return { amount: reward, tip, type };
}

// Helper function to calculate distance bonus
function calculateDistanceBonus(distance: number): number {
  if (distance <= DISTANCE_BONUS_THRESHOLD) return 0;

  const extraDistance = distance - DISTANCE_BONUS_THRESHOLD;
  const bonusSegments = Math.floor(extraDistance / DISTANCE_BONUS_SEGMENT);

  return bonusSegments * DISTANCE_BONUS_PER_SEGMENT;
}
