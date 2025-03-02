import alt from "@altv/server";
import { minutesToMilliseconds } from "date-fns";
import { getLevel } from "@shared/modules/experience/experience-table";
import { InGamePlayer, isInGame, needsToBeInGame } from "@/core/utility/assertions";
import { NotificationType } from "@shared/interfaces";
import { PlayerFlags } from "@shared/store/game-state.store";
import { registerCmd, sendChatMessage } from "@/modules/chat";
// Add imports for RPC system
import { FromClient } from "@shared/calls/server/from-client";
import { rpc } from "@/core/rpc";
import { MessageType } from "@shared/modules/chat";

const PrivateHomes: Record<string, PrivateHome[]> = (
  await import("@/data/private-homes.positions.json")
).default as any;
const GtaLens: GtaLensData = (await import("@/data/gta-lens.positions.json")).default as any;

type PrivateHome = {
  id: number;
  street: string;
  pos: alt.IVector3;
};

type GtaLensData = {
  maps: {
    "pizza-delivery": {
      locationGroups: {
        objectName: string;
        id: number;
        name: string;
        locations: {
          id: number;
          c: [x: number, y: number, z: number];
        }[];
      }[];
    };
  };
};

interface HomeDeliveryPoint {
  name: string;
  pos: alt.IVector3;
}

type DeliveryPoint = alt.IVector3 | HomeDeliveryPoint;

// Define delivery data structure for a single delivery
interface PlayerDelivery {
  collectionPoint: alt.IVector3;
  deliveryPoint: DeliveryPoint;
  isPrivateHome: boolean;
  timeLimit: number;
  startTime: number;
  bonus: number;
  nextDeliveryTime: number;
  isCollected: boolean;
  status: string;
}

// Add FoodDeliveryStats interface after the other interfaces
interface FoodDeliveryStats {
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  tipsReceived: number;
  totalEarnings: number;
  fastestDelivery: number; // in milliseconds
  averageDeliveryTime: number; // in milliseconds
  privateHomeDeliveries: number;
  regularDeliveries: number;
  lastDeliveryDate: number;
}

const privateHomeDeliveryPoints = Object.values(PrivateHomes)
  .flat()
  .map((home) => ({
    name: home.street,
    pos: {
      x: home.pos.x,
      y: home.pos.y,
      z: home.pos.z,
    },
  }));

const pizzaCollectionPoints =
  GtaLens.maps["pizza-delivery"].locationGroups
    .find((group) => group.objectName === "Restaurant")
    ?.locations.map((location) => ({
      x: location.c[0],
      y: location.c[1],
      z: location.c[2],
    })) ?? [];

const pizzaDeliveryPoints =
  GtaLens.maps["pizza-delivery"].locationGroups
    .find((group) => group.objectName === "Delivery location")
    ?.locations.map((location) => ({
      x: location.c[0],
      y: location.c[1],
      z: location.c[2],
    })) ?? [];

console.log("[FoodDelivery-Server] Loaded points:", {
  privateHomes: privateHomeDeliveryPoints.length,
  collectionPoints: pizzaCollectionPoints.length,
  deliveryPoints: pizzaDeliveryPoints.length,
});

// Base cooldown in milliseconds (for level 1)
const BASE_COOLDOWN = minutesToMilliseconds(5);
// Minimum cooldown in milliseconds (for level 99)
const MIN_COOLDOWN = minutesToMilliseconds(2);

// Base time limit for deliveries in milliseconds (for level 1)
const BASE_TIME_LIMIT = minutesToMilliseconds(5);
// Minimum time limit in milliseconds (for level 99)
const MIN_TIME_LIMIT = minutesToMilliseconds(3);

// Maximum concurrent deliveries a player can have
const MAX_CONCURRENT_DELIVERIES = 3;

// Maximum distance for regular delivery points (in game units)
const MAX_DELIVERY_DISTANCE = 800;
// Minimum number of delivery points to select from when finding nearby locations
const MIN_DELIVERY_POINTS_POOL = 5;

// Add a new flag for delivery availability
const DELIVERY_AVAILABILITY_FLAG = PlayerFlags.AcceptingDeliveries;

// Utility function to get player's active deliveries
function getPlayerDeliveries(player: InGamePlayer): Map<number, PlayerDelivery> {
  console.log(`[FoodDelivery-Server] Getting active deliveries for player ID: ${player.id}`);
  // Initialize the map if it doesn't exist
  if (!player.gameState.foodDelivery.activeDeliveries) {
    console.log("[FoodDelivery-Server] Initializing activeDeliveries map in gameState");
    player.gameState.foodDelivery.activeDeliveries = new Map();
  }
  return player.gameState.foodDelivery.activeDeliveries;
}

// Check if a player is accepting new deliveries
function isAcceptingDeliveries(player: InGamePlayer): boolean {
  // If the flag isn't set yet, initialize it to false (not accepting deliveries by default)
  if (
    !player.gameState.flags.has(DELIVERY_AVAILABILITY_FLAG) &&
    !player.gameState.flags.has(PlayerFlags.HasActiveDelivery)
  ) {
    return false;
  }
  return player.gameState.flags.has(DELIVERY_AVAILABILITY_FLAG);
}

// Check if a player has reached their max deliveries
function hasReachedMaxDeliveries(player: InGamePlayer): boolean {
  const playerDeliveries = getPlayerDeliveries(player);
  const deliveryCount = Array.from(playerDeliveries.entries()).filter(
    ([deliveryId, delivery]) => delivery.collectionPoint && delivery.deliveryPoint,
  ).length;

  console.log(
    `[FoodDelivery-Server] Player ${player.id} has ${deliveryCount}/${MAX_CONCURRENT_DELIVERIES} active deliveries`,
  );
  return deliveryCount >= MAX_CONCURRENT_DELIVERIES;
}

export function cooldownUntilNextDelivery(player: InGamePlayer) {
  const level = getLevel(player.character.skills.foodDelivery.exp);
  const cappedLevel = Math.min(level, 99);

  // Linear decrease from BASE_COOLDOWN at level 1 to MIN_COOLDOWN at level 99
  const cooldown = BASE_COOLDOWN - ((BASE_COOLDOWN - MIN_COOLDOWN) * (cappedLevel - 1)) / 98;
  const finalCooldown = Math.max(Math.round(cooldown), MIN_COOLDOWN);

  console.log(
    `[FoodDelivery-Server] Calculated cooldown for player ${player.id} (level ${level}): ${finalCooldown}ms`,
  );
  return finalCooldown;
}

// Calculate delivery time limit based on player level
export function getDeliveryTimeLimit(player: InGamePlayer) {
  const level = getLevel(player.character.skills.foodDelivery.exp);
  const cappedLevel = Math.min(level, 99);

  // Linear decrease from BASE_TIME_LIMIT at level 1 to MIN_TIME_LIMIT at level 99
  const timeLimit = BASE_TIME_LIMIT - ((BASE_TIME_LIMIT - MIN_TIME_LIMIT) * (cappedLevel - 1)) / 98;
  const finalTimeLimit = Math.max(Math.round(timeLimit), MIN_TIME_LIMIT);

  console.log(
    `[FoodDelivery-Server] Calculated time limit for player ${player.id} (level ${level}): ${finalTimeLimit}ms`,
  );
  return finalTimeLimit;
}

// Calculate chance of getting a private home delivery based on level
function getPrivateHomeChance(level: number) {
  // At level 1: 5% chance, at level 99: 40% chance
  const chance = 0.05 + (0.35 * Math.min(level, 99)) / 99;
  console.log(`[FoodDelivery-Server] Private home chance for level ${level}: ${chance * 100}%`);
  return chance;
}

// Calculate distance-based bonus for private homes
function calculatePrivateHomeBonus(
  collectionPoint: alt.IVector3,
  deliveryPoint: HomeDeliveryPoint,
) {
  // Create a Vector3 from the delivery point position
  const deliveryPos = new alt.Vector3(
    deliveryPoint.pos.x,
    deliveryPoint.pos.y,
    deliveryPoint.pos.z,
  );

  // Use alt.Vector3's built-in distance calculation
  const distance = deliveryPos.distanceTo(collectionPoint);

  // Base bonus factor + additional bonus based on distance
  // For every 500 units of distance, add 5% bonus
  const distanceBonus = (distance / 500) * 0.05;
  const totalBonus = 1.2 + distanceBonus; // Base 20% bonus + distance bonus

  console.log(
    `[FoodDelivery-Server] Calculated private home bonus: ${totalBonus.toFixed(2)}x (distance: ${distance.toFixed(0)} units)`,
  );
  return totalBonus;
}

// Helper function to calculate distance between two points
function calculateDistance(point1: alt.IVector3, point2: alt.IVector3): number {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) +
      Math.pow(point1.y - point2.y, 2) +
      Math.pow(point1.z - point2.z, 2),
  );
}

// Helper function to get nearby delivery points
function getNearbyDeliveryPoints(
  collectionPoint: alt.IVector3,
  maxDistance: number,
): alt.IVector3[] {
  // Sort delivery points by distance to collection point
  const pointsWithDistance = pizzaDeliveryPoints.map((point) => ({
    point,
    distance: calculateDistance(collectionPoint, point),
  }));

  // Filter points within max distance
  let nearbyPoints = pointsWithDistance
    .filter((item) => item.distance <= maxDistance)
    .map((item) => item.point);

  // If we don't have enough points, just use the closest ones
  if (nearbyPoints.length < MIN_DELIVERY_POINTS_POOL) {
    pointsWithDistance.sort((a, b) => a.distance - b.distance);
    nearbyPoints = pointsWithDistance.slice(0, MIN_DELIVERY_POINTS_POOL).map((item) => item.point);
  }

  console.log(
    `[FoodDelivery-Server] Found ${nearbyPoints.length} nearby delivery points within ${maxDistance} units`,
  );
  return nearbyPoints;
}

export function setNextDeliveryPoint(player: alt.Player) {
  if (!isInGame(player)) {
    return;
  }

  console.log(`[FoodDelivery-Server] Setting next delivery point for player ${player.id}`);

  // Check if player is accepting deliveries
  if (!isAcceptingDeliveries(player)) {
    console.log(`[FoodDelivery-Server] Player ${player.id} is not accepting deliveries`);
    return;
  }

  const level = getLevel(player.character.skills.foodDelivery.exp);

  // Check if player has reached maximum deliveries
  if (hasReachedMaxDeliveries(player)) {
    console.log(`[FoodDelivery-Server] Player ${player.id} has reached max deliveries`);
    player.notify(
      NotificationType.Warning,
      `You can only have up to ${MAX_CONCURRENT_DELIVERIES} active deliveries at once. Complete some deliveries first.`,
      { title: "Food Delivery" },
    );
    return;
  }

  // Find the nearest collection point to the player
  let nearestPoint = pizzaCollectionPoints[0];
  let shortestDistance = Number.MAX_VALUE;

  for (const point of pizzaCollectionPoints) {
    const distance = player.pos.distanceTo(point);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestPoint = point;
    }
  }

  const collectionPoint = nearestPoint;
  console.log(
    `[FoodDelivery-Server] Selected nearest collection point:`,
    collectionPoint,
    `distance: ${shortestDistance.toFixed(2)}`,
  );

  // Get delivery points based on type
  let deliveryPoint: DeliveryPoint;
  let isPrivateHome = false;
  let bonus = 1.0;
  let deliveryName = "";

  // Determine if this delivery should be to a private home based on level
  isPrivateHome = Math.random() < getPrivateHomeChance(level);
  console.log(`[FoodDelivery-Server] Delivery will be to private home: ${isPrivateHome}`);

  if (isPrivateHome && privateHomeDeliveryPoints.length > 0) {
    // Select a random private home
    const selectedHome =
      privateHomeDeliveryPoints[Math.floor(Math.random() * privateHomeDeliveryPoints.length)];
    deliveryName = selectedHome.name;
    console.log(`[FoodDelivery-Server] Selected private home: ${deliveryName}`);

    // Calculate bonus based on distance
    bonus = calculatePrivateHomeBonus(collectionPoint, selectedHome);

    // Format for game state
    deliveryPoint = {
      x: selectedHome.pos.x,
      y: selectedHome.pos.y,
      z: selectedHome.pos.z,
      name: selectedHome.name,
    };
  } else {
    // Regular delivery point - select from nearby points instead of all points
    const nearbyPoints = getNearbyDeliveryPoints(collectionPoint, MAX_DELIVERY_DISTANCE);
    const selectedPoint = nearbyPoints[Math.floor(Math.random() * nearbyPoints.length)];
    isPrivateHome = false;
    console.log(`[FoodDelivery-Server] Selected nearby regular delivery point:`, selectedPoint);

    // Format for game state
    deliveryPoint = {
      x: selectedPoint.x,
      y: selectedPoint.y,
      z: selectedPoint.z,
    };
  }

  // Calculate delivery time limit
  const timeLimit = getDeliveryTimeLimit(player);
  const now = Date.now();

  // Generate a unique delivery ID
  const deliveryId = Math.floor(Math.random() * 1000000000);
  console.log(`[FoodDelivery-Server] Generated delivery ID: ${deliveryId}`);

  // Create new delivery data
  const deliveryData: PlayerDelivery = {
    collectionPoint,
    deliveryPoint,
    isPrivateHome,
    timeLimit,
    startTime: now,
    bonus,
    nextDeliveryTime: now + cooldownUntilNextDelivery(player),
    isCollected: false,
    status: "pending",
  };

  // Add the delivery to player's active deliveries
  const playerDeliveries = getPlayerDeliveries(player);
  playerDeliveries.set(deliveryId, deliveryData);
  console.log(
    `[FoodDelivery-Server] Added delivery ${deliveryId} to player ${player.id}'s active deliveries`,
  );

  // Set player flags if not already set
  player.gameState.flags.add(PlayerFlags.HasActiveDelivery);
  console.log(`[FoodDelivery-Server] Set HasActiveDelivery flag for player ${player.id}`);

  // Notify player of new delivery
  if (isPrivateHome) {
    player.notify(
      NotificationType.Info,
      `New private home delivery to ${deliveryName}! ${Math.round((bonus - 1) * 100)}% bonus available.`,
      { title: "Food Delivery" },
    );
  } else {
    player.notify(
      NotificationType.Info,
      "New food delivery available from the nearest pizza place! Check your GPS for pickup and delivery locations.",
      { title: "Food Delivery" },
    );
  }
  console.log(`[FoodDelivery-Server] Sent notification to player ${player.id} about new delivery`);

  // Set timeouts for delivery reminders
  const halfTimeReminder = Math.floor(timeLimit / 2);
  console.log(`[FoodDelivery-Server] Setting reminder timeout for ${halfTimeReminder}ms`);

  alt.Timers.setTimeout(() => {
    if (isInGame(player)) {
      console.log(`[FoodDelivery-Server] Half-time reminder triggered for delivery ${deliveryId}`);
      const activeDeliveries = getPlayerDeliveries(player);
      if (activeDeliveries.has(deliveryId)) {
        player.notify(
          NotificationType.Warning,
          `You have ${Math.floor(timeLimit / 2 / 1000)} seconds remaining for your delivery!`,
          { title: "Food Delivery" },
        );
        console.log(`[FoodDelivery-Server] Sent half-time reminder to player ${player.id}`);
      } else {
        console.log(
          `[FoodDelivery-Server] Delivery ${deliveryId} no longer active, skipping reminder`,
        );
      }
    }
  }, halfTimeReminder);

  // Schedule next delivery if player isn't at max deliveries
  if (!hasReachedMaxDeliveries(player)) {
    const nextDeliveryTime = cooldownUntilNextDelivery(player);
    console.log(
      `[FoodDelivery-Server] Scheduling next delivery in ${nextDeliveryTime}ms for player ${player.id}`,
    );
    alt.Timers.setTimeout(setNextDeliveryPoint, nextDeliveryTime, player);
  } else {
    console.log(
      `[FoodDelivery-Server] Player ${player.id} at max deliveries, not scheduling next delivery`,
    );
  }
}

// Function to get all active deliveries for a player
export function getPlayerActiveDeliveries(player: InGamePlayer): [number, PlayerDelivery][] {
  console.log(`[FoodDelivery-Server] Getting all active deliveries for player ${player.id}`);
  const playerDeliveries = getPlayerDeliveries(player);
  const deliveriesArray = Array.from(playerDeliveries.entries());
  console.log(
    `[FoodDelivery-Server] Found ${deliveriesArray.length} active deliveries for player ${player.id}`,
  );
  return deliveriesArray;
}

// Function to calculate rewards based on delivery completion time
export function calculateDeliveryReward(
  player: InGamePlayer,
  deliveryData: PlayerDelivery,
  deliveryTime: number,
): number {
  console.log(
    `[FoodDelivery-Server] Calculating reward for player ${player.id}, delivery time: ${deliveryTime}ms`,
  );
  const baseReward = 100; // Base reward amount - adjust as needed
  let timeBonus = 1.0;

  // Calculate time bonus/penalty based on delivery time compared to time limit
  if (deliveryTime <= deliveryData.timeLimit * 0.6) {
    // Very quick delivery (under 60% of time limit) - 25% chance of tip
    const gotTip = Math.random() < 0.25;
    timeBonus = gotTip ? 1.25 : 1.0;
    console.log(
      `[FoodDelivery-Server] Very quick delivery, got tip: ${gotTip}, bonus: ${timeBonus}`,
    );
  } else if (deliveryTime <= deliveryData.timeLimit * 0.8) {
    // Fast delivery (under 80% of time limit) - 15% chance of tip
    const gotTip = Math.random() < 0.15;
    timeBonus = gotTip ? 1.15 : 1.0;
    console.log(`[FoodDelivery-Server] Fast delivery, got tip: ${gotTip}, bonus: ${timeBonus}`);
  } else if (deliveryTime > deliveryData.timeLimit * 2.2) {
    // Very late delivery (over 220% of time limit) - significant penalty
    timeBonus = 0.5;
    console.log(`[FoodDelivery-Server] Very late delivery, penalty applied: ${timeBonus}`);
  } else if (deliveryTime > deliveryData.timeLimit) {
    // Late delivery (over time limit) - small penalty
    timeBonus = 0.75;
    console.log(`[FoodDelivery-Server] Late delivery, penalty applied: ${timeBonus}`);
  } else {
    console.log(`[FoodDelivery-Server] On-time delivery, no bonus or penalty`);
  }

  // Calculate final reward with bonuses
  const finalReward = Math.round(baseReward * timeBonus * deliveryData.bonus);
  console.log(
    `[FoodDelivery-Server] Final reward: ${finalReward} (base: ${baseReward}, time bonus: ${timeBonus}, delivery bonus: ${deliveryData.bonus})`,
  );
  return finalReward;
}

// Track food delivery stats using gameState
// Initialize stats object if it doesn't exist
function getDeliveryStats(player: InGamePlayer): FoodDeliveryStats {
  if (!player.gameState.foodDelivery.stats) {
    const defaultStats: FoodDeliveryStats = {
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
      tipsReceived: 0,
      totalEarnings: 0,
      fastestDelivery: 0,
      averageDeliveryTime: 0,
      privateHomeDeliveries: 0,
      regularDeliveries: 0,
      lastDeliveryDate: 0,
    };
    player.gameState.foodDelivery.stats = defaultStats;
    return defaultStats;
  }
  return player.gameState.foodDelivery.stats;
}

// Save updated stats back to gameState and character object
function saveDeliveryStats(player: InGamePlayer, stats: FoodDeliveryStats) {
  player.gameState.foodDelivery.stats = stats;

  // Try to save to character object using any to bypass type checking
  // This will work when the server has the updated schema and will be a no-op otherwise
  try {
    const character = player.character as any;
    if (character?.skills?.foodDelivery) {
      character.skills.foodDelivery.stats = stats;
    }
  } catch (e) {
    console.log("[FoodDelivery-Server] Could not save stats to character object directly");
  }
}

// Update stats tracking function to use metadata
function updateDeliveryStats(
  player: InGamePlayer,
  delivery: PlayerDelivery,
  timeTaken: number,
  reward: number,
  gotTip: boolean,
) {
  const stats = getDeliveryStats(player);

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

  // Save updated stats
  saveDeliveryStats(player, stats);
}

// Function to complete a specific delivery and give rewards
export function completeDelivery(player: InGamePlayer, deliveryId?: number): void {
  console.log(
    `[FoodDelivery-Server] Completing delivery for player ${player.id}, deliveryId: ${deliveryId || "not specified"}`,
  );
  const playerDeliveries = getPlayerDeliveries(player);

  // If no specific delivery ID is provided, get the first active delivery
  let targetDeliveryId: number | undefined = deliveryId;
  let targetDelivery: PlayerDelivery | undefined;

  if (!targetDeliveryId) {
    // Get the first delivery if no ID specified
    const firstDelivery = playerDeliveries.entries().next().value;
    if (firstDelivery) {
      [targetDeliveryId, targetDelivery] = firstDelivery;
      console.log(
        `[FoodDelivery-Server] No delivery ID specified, using first delivery: ${targetDeliveryId}`,
      );
    }
  } else {
    targetDelivery = playerDeliveries.get(targetDeliveryId);
    console.log(
      `[FoodDelivery-Server] Looking up delivery ID: ${targetDeliveryId}, found: ${!!targetDelivery}`,
    );
  }

  // Check if player has this active delivery
  if (!targetDeliveryId || !targetDelivery) {
    console.log(`[FoodDelivery-Server] No active delivery found for player ${player.id}`);
    player.notify(NotificationType.Error, "You don't have an active delivery to complete!", {
      title: "Food Delivery",
    });
    return;
  }

  // Calculate time taken and rewards
  const timeTaken = Date.now() - targetDelivery.startTime;
  console.log(`[FoodDelivery-Server] Time taken for delivery: ${timeTaken}ms`);
  const reward = calculateDeliveryReward(player, targetDelivery, timeTaken);
  const expGain = Math.max(10, Math.round(reward / 10));
  console.log(`[FoodDelivery-Server] Calculated reward: ${reward}, exp gain: ${expGain}`);

  // Track delivery status before removing
  targetDelivery.status = "delivered";

  // Remove the completed delivery
  playerDeliveries.delete(targetDeliveryId);
  console.log(
    `[FoodDelivery-Server] Removed delivery ${targetDeliveryId} from player ${player.id}'s active deliveries`,
  );

  // Update flags if player has no more deliveries
  if (playerDeliveries.size === 0) {
    console.log(
      `[FoodDelivery-Server] Player ${player.id} has no more deliveries, removing HasActiveDelivery flag`,
    );
    player.gameState.flags.delete(PlayerFlags.HasActiveDelivery);
  }

  // Grant rewards and experience
  if (player.character && player.character.skills && player.character.skills.foodDelivery) {
    // Add money
    if (player.character.money) {
      player.character.money += reward;
      console.log(
        `[FoodDelivery-Server] Player ${player.id} new money balance: ${player.character.money}`,
      );

      // Add experience
      player.character.skills.foodDelivery.exp += expGain;
      console.log(
        `[FoodDelivery-Server] Added ${expGain} experience to player ${player.id}'s food delivery skill`,
      );
    }

    // Determine if this was a fast delivery that received a tip
    const gotTip =
      timeTaken <= targetDelivery.timeLimit * 0.6 && reward > 100 * targetDelivery.bonus;

    // Update stats
    updateDeliveryStats(player, targetDelivery, timeTaken, reward, gotTip);

    // Show completion notification with appropriate message based on timing
    if (timeTaken <= targetDelivery.timeLimit * 0.6) {
      if (gotTip) {
        // Got a tip
        player.notify(
          NotificationType.Success,
          `Lightning fast delivery! Customer tipped you extra. Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      } else {
        player.notify(
          NotificationType.Success,
          `Very fast delivery! Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      }
    } else if (timeTaken <= targetDelivery.timeLimit) {
      player.notify(
        NotificationType.Success,
        `Delivery completed on time. Received $${reward} and ${expGain} EXP.`,
        { title: "Food Delivery Complete!" },
      );
    } else {
      player.notify(
        NotificationType.Warning,
        `Late delivery! Received reduced payment of $${reward} and ${expGain} EXP.`,
        { title: "Food Delivery Complete" },
      );
    }

    // Add a new delivery if player delivered successfully and isn't at max
    if (timeTaken <= targetDelivery.timeLimit * 1.5 && !hasReachedMaxDeliveries(player)) {
      console.log(
        `[FoodDelivery-Server] Scheduling new delivery for player ${player.id} in 5 seconds`,
      );
      alt.Timers.setTimeout(setNextDeliveryPoint, 5000, player); // Add a new one after 5 seconds
    }
  } else {
    console.error(
      `[FoodDelivery-Server] Player ${player.id} missing required character structure for delivery rewards`,
    );
  }
}

// List active deliveries for player
export function listDeliveries(player: InGamePlayer): void {
  console.log(`[FoodDelivery-Server] Listing deliveries for player ${player.id}`);
  const activeDeliveries = getPlayerActiveDeliveries(player);

  if (activeDeliveries.length === 0) {
    console.log(`[FoodDelivery-Server] No active deliveries for player ${player.id}`);
    player.notify(NotificationType.Info, "You don't have any active deliveries.", {
      title: "Food Delivery",
    });
    return;
  }

  // Show delivery info
  console.log(
    `[FoodDelivery-Server] Player ${player.id} has ${activeDeliveries.length} active deliveries`,
  );
  player.notify(
    NotificationType.Info,
    `You have ${activeDeliveries.length} active food delivery tasks.`,
    { title: "Food Delivery" },
  );

  // Could add more detailed info via UI or chat messages if needed
}

console.log("[FoodDelivery-Server] Registering chat commands");

registerCmd("pizza", (player) => {
  needsToBeInGame(player);
  toggleDeliveryAvailability(player);

  if (isAcceptingDeliveries(player)) {
    sendChatMessage(
      player,
      "You're currently online and accepting deliveries. Use /pizza to toggle off.",
      MessageType.Success,
    );
  } else {
    sendChatMessage(
      player,
      "You're currently offline. Use /pizza to go online and accept orders.",
      MessageType.Warning,
    );
  }
});

registerCmd("deliveries", (player) => {
  console.log(`[FoodDelivery-Server] Player ${player.id} used /deliveries command`);
  needsToBeInGame(player);
  listDeliveries(player);
});

registerCmd("complete", (player) => {
  console.log(`[FoodDelivery-Server] Player ${player.id} used /complete command`);
  needsToBeInGame(player);
  completeDelivery(player);
});

// Add RPC handlers for food delivery functions
console.log("[FoodDelivery-Server] Registering RPC handlers");

// Constants for security checks
const INTERACTION_DISTANCE = 5.0; // Maximum distance for interaction with pickup/delivery points
const MIN_DELIVERY_TIME = 10000; // Minimum time (ms) a delivery should take (prevent instant completions)
const AVG_SPEED_LIMIT = 70.0; // Maximum average speed in m/s (~250 km/h)

/**
 * Check if player is within valid distance of a point
 */
function isPlayerNearPoint(
  player: alt.Player,
  point: alt.IVector3,
  maxDistance: number = INTERACTION_DISTANCE,
): boolean {
  const distance = player.pos.distanceTo(point);
  return distance <= maxDistance;
}

/**
 * Validate delivery timing based on distance and elapsed time
 */
function isDeliveryTimingValid(
  startPoint: alt.IVector3,
  endPoint: alt.IVector3,
  elapsedTimeMs: number,
): boolean {
  // Get distance between points
  const distance = new alt.Vector3(endPoint.x, endPoint.y, endPoint.z).distanceTo(startPoint);

  // Skip time check for very short distances
  if (distance < 100) return true;

  // Enforce minimum delivery time to prevent teleport hacks
  if (elapsedTimeMs < MIN_DELIVERY_TIME) {
    console.log(
      `[FoodDelivery-Server] Delivery too fast: ${elapsedTimeMs}ms for ${distance.toFixed(1)} meters`,
    );
    return false;
  }

  // Calculate average travel speed in meters per second
  const elapsedTimeSec = elapsedTimeMs / 1000;
  const avgSpeed = distance / elapsedTimeSec;

  // Check if average speed is reasonable
  if (avgSpeed > AVG_SPEED_LIMIT) {
    console.log(
      `[FoodDelivery-Server] Unrealistic delivery speed detected: ${avgSpeed.toFixed(1)} m/s (${(avgSpeed * 3.6).toFixed(1)} km/h)`,
    );
    return false;
  }

  return true;
}

// Update RPC handlers with security checks
rpc.registerClient(FromClient.FOOD_DELIVERY_COLLECT, (player, deliveryId: number) => {
  console.log(
    `[FoodDelivery-Server] Player ${player.id} collecting food for delivery ${deliveryId}`,
  );
  needsToBeInGame(player);

  const playerDeliveries = getPlayerDeliveries(player);
  const delivery = playerDeliveries.get(deliveryId);

  if (!delivery) {
    console.log(`[FoodDelivery-Server] Delivery ${deliveryId} not found for player ${player.id}`);
    player.notify(NotificationType.Error, "Delivery not found!", { title: "Food Delivery" });
    return false;
  }

  // Check if player is near the collection point
  if (!isPlayerNearPoint(player, delivery.collectionPoint)) {
    console.log(
      `[FoodDelivery-Server] Position check failed: Player ${player.id} is not near the collection point`,
    );
    player.notify(NotificationType.Error, "You need to be at the pickup location!", {
      title: "Food Delivery",
    });
    return false;
  }

  // Mark as collected by updating startTime and isCollected flag
  delivery.startTime = Date.now();
  delivery.isCollected = true;
  delivery.status = "collected";
  playerDeliveries.set(deliveryId, delivery);
  console.log(
    `[FoodDelivery-Server] Delivery ${deliveryId} marked as collected for player ${player.id}`,
  );

  player.notify(NotificationType.Success, "Food collected! Deliver it to the marked location.", {
    title: "Food Delivery",
  });

  return true;
});

// Handler for completing delivery
rpc.registerClient(FromClient.FOOD_DELIVERY_COMPLETE, (player, deliveryId: number) => {
  console.log(`[FoodDelivery-Server] Player ${player.id} completing delivery ${deliveryId}`);
  needsToBeInGame(player);

  const playerDeliveries = getPlayerDeliveries(player);
  const delivery = playerDeliveries.get(deliveryId);

  if (!delivery) {
    console.log(`[FoodDelivery-Server] Delivery ${deliveryId} not found for player ${player.id}`);
    player.notify(NotificationType.Error, "Delivery not found!", { title: "Food Delivery" });
    return { reward: 0, exp: 0 };
  }

  // Security check: Is food collected?
  if (!delivery.isCollected) {
    console.log(
      `[FoodDelivery-Server] Security check failed: Player ${player.id} tried to complete delivery without collecting food`,
    );
    player.notify(NotificationType.Error, "You need to collect the food first!", {
      title: "Food Delivery",
    });
    return { reward: 0, exp: 0 };
  }

  // Security check: Is player at the delivery location?
  const deliveryPoint =
    "pos" in delivery.deliveryPoint ? delivery.deliveryPoint.pos : delivery.deliveryPoint;

  if (!isPlayerNearPoint(player, deliveryPoint)) {
    console.log(
      `[FoodDelivery-Server] Position check failed: Player ${player.id} is not at the delivery location`,
    );
    player.notify(NotificationType.Error, "You need to be at the delivery location!", {
      title: "Food Delivery",
    });
    return { reward: 0, exp: 0 };
  }

  // Calculate time taken and rewards
  const timeTaken = Date.now() - delivery.startTime;
  console.log(`[FoodDelivery-Server] Time taken for delivery: ${timeTaken}ms`);

  // Security check: Is the delivery timing realistic?
  if (!isDeliveryTimingValid(delivery.collectionPoint, deliveryPoint, timeTaken)) {
    console.log(
      `[FoodDelivery-Server] Time check failed: Player ${player.id} completed delivery too quickly`,
    );
    player.notify(NotificationType.Error, "Invalid delivery timing detected!", {
      title: "Food Delivery",
    });
    return { reward: 0, exp: 0 };
  }

  const reward = calculateDeliveryReward(player, delivery, timeTaken);
  const expGain = Math.max(10, Math.round(reward / 10));
  console.log(`[FoodDelivery-Server] Calculated reward: ${reward}, exp gain: ${expGain}`);

  // Track delivery status before removing
  delivery.status = "delivered";

  // Remove the completed delivery
  playerDeliveries.delete(deliveryId);
  console.log(
    `[FoodDelivery-Server] Removed delivery ${deliveryId} from player ${player.id}'s active deliveries`,
  );

  // Update flags if player has no more deliveries
  if (playerDeliveries.size === 0) {
    console.log(
      `[FoodDelivery-Server] Player ${player.id} has no more deliveries, removing HasActiveDelivery flag`,
    );
    player.gameState.flags.delete(PlayerFlags.HasActiveDelivery);
  }

  // Grant rewards and experience
  if (player.character && player.character.skills && player.character.skills.foodDelivery) {
    // Add money
    if (player.character.money) {
      player.character.money += reward;
      console.log(
        `[FoodDelivery-Server] Player ${player.id} new money balance: ${player.character.money}`,
      );

      // Add experience
      player.character.skills.foodDelivery.exp += expGain;
      console.log(
        `[FoodDelivery-Server] Added ${expGain} experience to player ${player.id}'s food delivery skill`,
      );
    }

    // Determine if this was a fast delivery that received a tip
    const gotTip = timeTaken <= delivery.timeLimit * 0.6 && reward > 100 * delivery.bonus;

    // Update stats
    updateDeliveryStats(player, delivery, timeTaken, reward, gotTip);

    // Show completion notification with appropriate message based on timing
    if (timeTaken <= delivery.timeLimit * 0.6) {
      if (gotTip) {
        // Got a tip
        player.notify(
          NotificationType.Success,
          `Lightning fast delivery! Customer tipped you extra. Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      } else {
        player.notify(
          NotificationType.Success,
          `Very fast delivery! Received $${reward} and ${expGain} EXP.`,
          { title: "Food Delivery Complete!" },
        );
      }
    } else if (timeTaken <= delivery.timeLimit) {
      player.notify(
        NotificationType.Success,
        `Delivery completed on time. Received $${reward} and ${expGain} EXP.`,
        { title: "Food Delivery Complete!" },
      );
    } else {
      player.notify(
        NotificationType.Warning,
        `Late delivery! Received reduced payment of $${reward} and ${expGain} EXP.`,
        { title: "Food Delivery Complete" },
      );
    }

    // Add a new delivery if player delivered successfully, isn't at max, and is accepting deliveries
    if (
      timeTaken <= delivery.timeLimit * 1.5 &&
      !hasReachedMaxDeliveries(player) &&
      isAcceptingDeliveries(player)
    ) {
      console.log(
        `[FoodDelivery-Server] Scheduling new delivery for player ${player.id} in 5 seconds`,
      );
      alt.Timers.setTimeout(setNextDeliveryPoint, 5000, player); // Add a new one after 5 seconds
    }

    return { reward, exp: expGain };
  }

  return { reward: 0, exp: 0 };
});

// Toggle player's availability for new deliveries
export function toggleDeliveryAvailability(player: InGamePlayer): boolean {
  const currentlyAccepting = isAcceptingDeliveries(player);

  if (currentlyAccepting) {
    // Turn off delivery availability
    player.gameState.flags.delete(DELIVERY_AVAILABILITY_FLAG);
    console.log(`[FoodDelivery-Server] Player ${player.id} stopped accepting new deliveries`);
    player.notify(
      NotificationType.Info,
      "You've gone offline. You won't receive any new delivery orders.",
      { title: "Food Delivery" },
    );
    return false;
  } else {
    // Turn on delivery availability and schedule first delivery
    player.gameState.flags.add(DELIVERY_AVAILABILITY_FLAG);
    console.log(`[FoodDelivery-Server] Player ${player.id} started accepting new deliveries`);
    player.notify(NotificationType.Success, "You're now online and accepting delivery orders!", {
      title: "Food Delivery",
    });

    // Schedule first delivery if player doesn't have max deliveries
    if (!hasReachedMaxDeliveries(player)) {
      const nextDeliveryTime = 5000; // 5 seconds delay for first delivery
      console.log(
        `[FoodDelivery-Server] Scheduling first delivery in ${nextDeliveryTime}ms for player ${player.id}`,
      );
      alt.Timers.setTimeout(setNextDeliveryPoint, nextDeliveryTime, player);
    }

    return true;
  }
}
