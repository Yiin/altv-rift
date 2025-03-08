import alt from "@altv/client";
import game from "@altv/natives";
import { DeliveryPoint } from "@shared/store/game-state.store";
import { gameState } from "@/core/store/game-state.store";
import { watch } from "vue";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { rpc } from "@/core/rpc";
import { FromClient } from "@shared/calls/server/from-client";
import { createPickup, Pickup } from "@/core/pickups/pickups.registry";
import { Blip } from "@altv/client";
import { getDeliveryPointPosition } from "@shared/modules/jobs/food-delivery";

// Constants
const INTERACTION_DISTANCE = 3.0; // Distance to interact with pickup/delivery points
// Use enum values for blip sprites
const BLIP_DELIVERY_SPRITE = alt.Enums.BlipSprite.PICKUP_ZONED; // Regular delivery location
const BLIP_PRIVATE_HOME_SPRITE = alt.Enums.BlipSprite.PICKUP_SLOW_TIME; // Private home deliveries

const colorMap = {
  [alt.Enums.BlipColor.ORANGE]: new alt.RGBA(255, 165, 0, 128),
  [alt.Enums.BlipColor.BLUE]: new alt.RGBA(0, 0, 255, 128),
  [alt.Enums.BlipColor.GREEN]: new alt.RGBA(0, 255, 0, 128),
  [alt.Enums.BlipColor.PURPLE]: new alt.RGBA(128, 0, 128, 128),
  [alt.Enums.BlipColor.PINK]: new alt.RGBA(255, 0, 255, 128),
  [alt.Enums.BlipColor.YELLOW]: new alt.RGBA(255, 255, 0, 128),
  [alt.Enums.BlipColor.RED]: new alt.RGBA(255, 0, 0, 128),
  [alt.Enums.BlipColor.LIGHT_BLUE]: new alt.RGBA(0, 191, 255, 128),
} as const;

// Initialize the food delivery system
whileInGame(() => {
  console.log("[FoodDelivery] Initializing food delivery system");

  /**
   * Step 1: Walk to collection point
   */
  const stopWatchingCollectionPoint = watch(gameState.foodDelivery, ({ collectionPoint, activeDeliveries }) => {
    if (collectionPoint && activeDeliveries.length === 0) {
      showHelpText("Press ~INPUT_CONTEXT~ to request delivery orders");
    } else {
      clearHelpText();
    }
  });

  /**
   * Step 2: Request orders
   */
  alt.Events.onKeyDown(({ key }) => {
    if (key === alt.Enums.KeyCode.E) {
      if (gameState.foodDelivery.collectionPoint) {
        rpc.callServer(FromClient.FOOD_DELIVERY_REQUEST_ORDERS);
      }
    }
  });

  /**
   * Step 3: Create pickups for received deliveries
   */
  const deliveryPickups = new Map<number, Pickup>();

  const stopWatchingActiveDeliveries = watch(gameState.foodDelivery, ({ activeDeliveries }) => {
    const availableColors = Object.entries(colorMap);

    // create pickups for new deliveries
    for (const delivery of activeDeliveries) {
      if (deliveryPickups.has(delivery.id)) {
        continue;
      }

      const index = Math.floor(Math.random() * availableColors.length);
      const [blipColor, markerColor] = availableColors[index];
      availableColors.splice(index, 1);

      const pickup = createPickup({
        pos: getDeliveryPointPosition(delivery.deliveryPoint),
        radius: INTERACTION_DISTANCE,
        onEnter() {
          console.log("onEnter, registering event listener");
          showHelpText("Press ~INPUT_CONTEXT~ to deliver food");

          const onKeyDown = alt.Events.onKeyDown(({ key }) => {
            if (key === alt.Enums.KeyCode.E) {
              rpc.callServer(FromClient.FOOD_DELIVERY_COMPLETE);
            }
          });

          return () => {
            console.log("onLeave, unregistering event listener");
            onKeyDown.destroy();
            clearHelpText();
          }
        },
      }).addMarker({
        type: alt.Enums.MarkerType.MARKER_CYLINDER,
        color: markerColor,
        markerType: alt.Enums.MarkerType.MARKER_CYLINDER,
      }).addBlip({
        sprite: delivery.isPrivateHome ? BLIP_PRIVATE_HOME_SPRITE : BLIP_DELIVERY_SPRITE,
        color: +blipColor,
        name: delivery.isPrivateHome ? `Private Home Delivery` : `Apartment Delivery`,
      });

      deliveryPickups.set(delivery.id, pickup);
    }

    // remove pickups for deliveries that no longer exist
    for (const [id, pickup] of deliveryPickups.entries()) {
      if (!gameState.foodDelivery.activeDeliveries.find((d) => d.id === id)) {
        console.log("deleting pickup", id);
        deliveryPickups.delete(id);
        pickup.destroy();
      }
    }
  });

  /**
   * Clear help text
   */
  function clearHelpText(): void {
    game.clearAllHelpMessages();
  }

  // Return cleanup function
  return () => {
    console.log("[FoodDelivery] Cleaning up food delivery system");

    stopWatchingCollectionPoint();
    stopWatchingActiveDeliveries();
  };
});

/**
 * Helper to set GPS waypoint
 */
function setWaypoint(xy: alt.IVector2): void {
  game.setNewWaypoint(xy.x, xy.y);
}

/**
 * Helper function to show help text
 */
function showHelpText(text: string): void {
  game.beginTextCommandDisplayHelp("STRING");
  game.addTextComponentSubstringPlayerName(text);
  game.endTextCommandDisplayHelp(0, false, true, -1);
}
