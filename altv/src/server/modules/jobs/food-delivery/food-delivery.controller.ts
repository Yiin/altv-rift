import alt from "@altv/server";
import { getLevel } from "@shared/modules/experience/experience-table";
import { InGamePlayer, isInGame, needsToBeInGame } from "@/core/utility/assertions";
import { NotificationType } from "@shared/interfaces";
import { DeliveryPoint, PlayerDelivery } from "@shared/store/game-state.store";
// Add imports for RPC system
import { FromClient } from "@shared/calls/server/from-client";
import { rpc } from "@/core/rpc";
import { createPickup } from "@/core/pickups/pickups.registry";
import { format } from "date-fns";
import { DeliveryRewardType } from "@shared/enums/delivery-reward-type";
import { calculatePrivateHomeBonus, completeDelivery } from "./lib";
import { getDeliveryPointPosition } from "@shared/modules/jobs/food-delivery";

const PrivateHomes: PrivateHome[] = (
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


const pizzaCollectionPoints: alt.IVector3[] =
  GtaLens.maps["pizza-delivery"].locationGroups
    .find((group) => group.objectName === "Restaurant")
    ?.locations.map((location) => ({
      x: location.c[0],
      y: location.c[1],
      z: location.c[2],
    })) ?? [];

const privateHomeDeliveryPoints = PrivateHomes;

const pizzaDeliveryPoints: alt.IVector3[] =
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

const METERS_PER_SECOND = 3; // Minimum delivery speed in meters per second

const MIN_CONCURRENT_DELIVERIES = 3;
const MAX_CONCURRENT_DELIVERIES = 6; // Maximum concurrent deliveries a player can have
// Constants for security checks
const INTERACTION_DISTANCE = 5.0; // Maximum distance for interaction with pickup/delivery points
const MIN_DELIVERY_TIME = 10000; // Minimum time (ms) a delivery should take (prevent instant completions)
const AVG_SPEED_LIMIT = 70.0; // Maximum average speed in m/s (~250 km/h)

for (const point of pizzaCollectionPoints) {
  createPickup({
    pos: point,
    radius: INTERACTION_DISTANCE,
    onEnter({ entity: player }) {
      if (player instanceof alt.Player === false || !isInGame(player)) {
        console.log(`[FoodDelivery-Server] Player ${player.id} is not a valid player`);
        return;
      }

      console.log(`[FoodDelivery-Server] Player ${player.id} is near a collection point`);
      player.gameState.foodDelivery.collectionPoint = point;
      return () => {
        console.log(`[FoodDelivery-Server] Player ${player.id} is no longer near a collection point`);
        player.gameState.foodDelivery.collectionPoint = null;
      }
    }
  }).addMarker({
    type: alt.Enums.MarkerType.MARKER_CYLINDER,
    color: new alt.RGBA(255, 0, 0, 128),
  }).addBlip({
    blipType: alt.Enums.BlipType.DESTINATION,
    sprite: 889, // alt.Enums.BlipSprite.PIZZA_THIS
    color: alt.Enums.BlipColor.ORANGE,
    name: "Pizza Restaurant",
    global: true,
  });
}


// Modify the RPC handler for requesting new orders at a collection point
rpc.registerClient(FromClient.FOOD_DELIVERY_REQUEST_ORDERS, (player: alt.Player) => {
  needsToBeInGame(player);
  console.log(`[FoodDelivery-Server] Player ${player.id} requesting delivery orders`);


  if (player.gameState.foodDelivery.activeDeliveries.length > 0) {
    console.log(`[FoodDelivery-Server] Player ${player.id} already has active deliveries`);
    return { success: false, reason: "You already have active deliveries. Complete them first." };
  }

  const collectionPoint = player.gameState.foodDelivery.collectionPoint;

  // Check if player is near a collection point
  if (!collectionPoint) {
    console.log(`[FoodDelivery-Server] Player ${player.id} is not near a collection point`);
    return { success: false, reason: "You need to be at a pizza restaurant to request deliveries." };
  }

  const amountOfDeliveries = MIN_CONCURRENT_DELIVERIES + ~~(Math.random() * (MAX_CONCURRENT_DELIVERIES - MIN_CONCURRENT_DELIVERIES));
  const unusedPrivateHomeDeliveryPoints = [...privateHomeDeliveryPoints];
  const unusedPizzaDeliveryPoints = [...pizzaDeliveryPoints];

  console.log(`[FoodDelivery-Server] Requesting ${amountOfDeliveries} deliveries`);

  for (let i = 0; i < amountOfDeliveries; i++) {
    // Generate a unique delivery ID
    const deliveryId = format(new Date(), "yyyyMMddHHmmss") + i.toString();

    // Create a new delivery at the collection point
    const foodDeliveryLevel = getLevel(player.character.skills.foodDelivery.exp);
    let deliveryPoint: DeliveryPoint;
    let isPrivateHome = false;
    let bonus = 1.0;

    // Determine if this delivery should be to a private home based on level
    isPrivateHome = Math.random() < getPrivateHomeChance(foodDeliveryLevel);

    console.log(`[FoodDelivery-Server] Delivery ${deliveryId} is private home: ${isPrivateHome}`);

    if (isPrivateHome && unusedPrivateHomeDeliveryPoints.length > 0) {
      const index = ~~(Math.random() * unusedPrivateHomeDeliveryPoints.length);
      // Select a random private home
      const selectedHome = unusedPrivateHomeDeliveryPoints.splice(index, 1)[0];

      // Calculate bonus based on distance
      bonus = calculatePrivateHomeBonus(collectionPoint, selectedHome);

      // Set delivery point
      deliveryPoint = selectedHome;
    } else if (unusedPizzaDeliveryPoints.length > 0) {
      const index = ~~(Math.random() * unusedPizzaDeliveryPoints.length);
      // Select a random pizza delivery point
      deliveryPoint = unusedPizzaDeliveryPoints.splice(index, 1)[0];

      isPrivateHome = false;
    } else {
      console.log(`[FoodDelivery-Server] No delivery points found.`);
      return { success: false, reason: "No delivery points found." };
    }

    // Calculate delivery time limit
    const timeLimit = getDeliveryTimeLimit(player, getDeliveryPointPosition(deliveryPoint));
    const now = Date.now();

    console.log(`[FoodDelivery-Server] Delivery ${deliveryId} will take ${timeLimit / 1000} seconds`);

    // Create new delivery data
    const delivery: PlayerDelivery = {
      id: parseInt(deliveryId),
      collectionPoint,
      deliveryPoint,
      isPrivateHome,
      timeLimit,
      startTime: now,
      bonus,
    };

    // Add the delivery to player's active deliveries
    player.gameState.foodDelivery.activeDeliveries.push(delivery);
  }

  // Notify player of new orders
  player.notify(
    NotificationType.Success,
    `You received ${amountOfDeliveries} new delivery orders! Check your GPS for pickup and delivery locations.`,
    { title: "Food Delivery" }
  );

  return { success: true };
});


// Update the completion handler to clear HasActiveDelivery flag when all deliveries are done
rpc.registerClient(FromClient.FOOD_DELIVERY_COMPLETE, (player) => {
  const INVALID_DELIVERY = { reward: 0, tip: 0, exp: 0, type: DeliveryRewardType.VERY_LATE };

  if (!isInGame(player)) {
    return INVALID_DELIVERY;
  }

  const delivery = player.gameState.foodDelivery.activeDeliveries.find((d) => player.pos.distanceTo(getDeliveryPointPosition(d)) < INTERACTION_DISTANCE);

  if (!delivery) {
    console.log(`[FoodDelivery-Server] Player ${player.id} is too far, distances:`);
    for (const d of player.gameState.foodDelivery.activeDeliveries) {
      console.log(`[FoodDelivery-Server] Delivery ${d.id}, distance: ${player.pos.distanceTo(getDeliveryPointPosition(d))}`);
    }
    return INVALID_DELIVERY;
  }

  console.log(`[FoodDelivery-Server] Player ${player.id} completing delivery: id=${delivery.id}`);

  // Calculate time taken for delivery
  const timeTaken = Date.now() - delivery.startTime;
  console.log(
    `[FoodDelivery-Server] Delivery time: id=${delivery.id}, time=${Math.round(timeTaken / 1000)}s, limit=${Math.round(delivery.timeLimit / 1000)
    }s`
  );

  // Verify delivery timing is valid (cheat detection)
  const isTimingValid = isDeliveryTimingValid(
    delivery.collectionPoint,
    getDeliveryPointPosition(delivery),
    timeTaken
  );

  if (!isTimingValid) {
    console.log(`[FoodDelivery-Server] Invalid delivery timing (possible teleport): id=${delivery.id}`);
    player.notify(
      NotificationType.Error,
      "This delivery took an impossibly short time. Possible cheating detected.",
      { title: "Food Delivery" }
    );
    return INVALID_DELIVERY;
  }

  return completeDelivery(player, delivery);
});

// Calculate delivery time limit based on player level
function getDeliveryTimeLimit(player: InGamePlayer, target: alt.IVector3) {
  const distance = player.pos.distanceTo(target);
  const timeLimit = distance / METERS_PER_SECOND;
  return timeLimit * 1000;
}

function getPrivateHomeChance(level: number) {
  // At level 1: 5% chance, at level 99: 40% chance
  return 0.05 + (0.35 * Math.min(level, 99)) / 99;
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
