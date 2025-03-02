import alt from "@altv/client";
import game from "@altv/natives";
import { PlayerFlags } from "@shared/store/game-state.store";
import { gameState } from "@/core/store/game-state.store";
import { watch, watchEffect } from "vue";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { rpc } from "@/core/rpc";
import { FromClient } from "@shared/calls/server/from-client";

// Constants
const MARKER_DISTANCE = 100; // Max distance to see markers
const INTERACTION_DISTANCE = 3.0; // Distance to interact with pickup/delivery points
// Use enum values for blip sprites
const BLIP_COLLECTION_SPRITE = 889; // Food pickup point PIZZA_THIS
const BLIP_DELIVERY_SPRITE = alt.Enums.BlipSprite.PICKUP_ZONED; // Regular delivery location
const BLIP_PRIVATE_HOME_SPRITE = alt.Enums.BlipSprite.PICKUP_SLOW_TIME; // Private home deliveries

// Array of distinct colors for different deliveries
const DELIVERY_COLORS = [
  alt.Enums.BlipColor.ORANGE,
  alt.Enums.BlipColor.BLUE,
  alt.Enums.BlipColor.GREEN,
  alt.Enums.BlipColor.PURPLE,
  alt.Enums.BlipColor.PINK,
  alt.Enums.BlipColor.YELLOW,
  alt.Enums.BlipColor.RED,
  alt.Enums.BlipColor.LIGHT_BLUE,
];

// Track already initiated collections to prevent spam
const pendingCollections = new Set<number>();

// Initialize the food delivery system
whileInGame(() => {
  console.log("[FoodDelivery] Initializing food delivery system");

  // Tracker for active objects
  const activeBlips = new Map<number, { collection: alt.Blip; delivery: alt.Blip }>();
  const activeMarkers = new Map<number, { collection?: alt.Marker; delivery?: alt.Marker }>();
  const activeColshapes = new Map<number, { collection?: alt.ColShape; delivery?: alt.ColShape }>();
  const deliveryTimers = new Map();
  const deliveryColors = new Map<number, alt.Enums.BlipColor>(); // Map to track colors for each delivery
  let currentFocusedDelivery: number | null = null; // Track which delivery is currently focused

  // Store player's current colshape state
  const playerColshapeState = {
    currentCollectionId: null as number | null,
    currentDeliveryId: null as number | null,
  };

  // Create a single key event handler for the entire system
  const keyEventHandler = alt.Events.onKeyDown(({ key }) => {
    if (key === alt.Enums.KeyCode.E) {
      // Handle collection
      if (playerColshapeState.currentCollectionId !== null) {
        const deliveryId = playerColshapeState.currentCollectionId;

        // Prevent spam-clicking collection
        if (pendingCollections.has(deliveryId)) {
          console.log(`[FoodDelivery] Collection already in progress: id=${deliveryId}`);
          return;
        }

        console.log(`[FoodDelivery] Player collecting food: id=${deliveryId}`);

        // Mark as pending to prevent repeated collections
        pendingCollections.add(deliveryId);

        rpc
          .callServer(FromClient.FOOD_DELIVERY_COLLECT, deliveryId)
          .then((success) => {
            if (success) {
              console.log(`[FoodDelivery] Food collection successful: id=${deliveryId}`);
              const delivery = gameState.foodDelivery.activeDeliveries?.get(deliveryId);
              if (delivery && delivery.deliveryPoint) {
                // Set this delivery as focused and update waypoint
                currentFocusedDelivery = deliveryId;
                setWaypoint(delivery.deliveryPoint.x, delivery.deliveryPoint.y);
              }

              // Update local state immediately to prevent further collections
              if (delivery) {
                delivery.isCollected = true;
              }
            } else {
              console.warn(`[FoodDelivery] Food collection failed: id=${deliveryId}`);
              // Remove from pending since it failed
              pendingCollections.delete(deliveryId);
            }
          })
          .catch((err) => {
            console.error(`[FoodDelivery] Error collecting food: id=${deliveryId}, error=${err}`);
            // Remove from pending since it failed
            pendingCollections.delete(deliveryId);
          });

        // We'll keep showing the help text until player exits the colshape
      }
      // Handle delivery
      else if (playerColshapeState.currentDeliveryId !== null) {
        const deliveryId = playerColshapeState.currentDeliveryId;
        console.log(`[FoodDelivery] Player delivering food: id=${deliveryId}`);

        rpc
          .callServer(FromClient.FOOD_DELIVERY_COMPLETE, deliveryId)
          .then((result) => {
            console.log(
              `[FoodDelivery] Delivery completed: id=${deliveryId}, reward=$${result.reward}, exp=${result.exp}`,
            );

            // Force UI refresh after delivery completion to ensure new deliveries get UI
            if (
              gameState.foodDelivery.activeDeliveries &&
              gameState.foodDelivery.activeDeliveries.size > 0
            ) {
              console.log(`[FoodDelivery] Force refreshing UI after delivery completion`);
              updateDeliveryUI(gameState.foodDelivery.activeDeliveries);
            }
          })
          .catch((err) => {
            console.error(
              `[FoodDelivery] Error completing delivery: id=${deliveryId}, error=${err}`,
            );
          });

        // We'll keep showing the help text until player exits the colshape
      }
    }
  });

  // Setup colshape event handlers
  const colshapeEnterHandler = alt.Events.onEntityColShapeEnter(({ entity, colShape }) => {
    // Make sure it's the local player
    if (entity !== alt.Player.local) return;

    // Get the delivery ID and type from colshape meta
    const deliveryId = colShape.meta?.deliveryId as number | undefined;
    const colshapeType = colShape.meta?.colshapeType as string | undefined;

    if (!deliveryId || !colshapeType) return;

    const delivery = gameState.foodDelivery.activeDeliveries?.get(deliveryId);
    if (!delivery) return;

    // Player entered colshape
    console.log(
      `[FoodDelivery] Player entered ${colshapeType} colshape for delivery: id=${deliveryId}`,
    );

    // Update the player's colshape state and show help text
    if (colshapeType === "collection" && !delivery.isCollected) {
      playerColshapeState.currentCollectionId = deliveryId;
      showHelpText("Press ~INPUT_CONTEXT~ to collect the food");
    } else if (colshapeType === "delivery" && delivery.isCollected) {
      playerColshapeState.currentDeliveryId = deliveryId;
      showHelpText("Press ~INPUT_CONTEXT~ to deliver the food");
    }
  });

  const colshapeLeaveHandler = alt.Events.onEntityColShapeLeave(({ entity, colShape }) => {
    // Make sure it's the local player
    if (entity !== alt.Player.local) return;

    // Get the delivery ID and type from colshape meta
    const deliveryId = colShape.meta?.deliveryId as number | undefined;
    const colshapeType = colShape.meta?.colshapeType as string | undefined;

    if (!deliveryId || !colshapeType) return;

    // Player exited colshape
    console.log(
      `[FoodDelivery] Player exited ${colshapeType} colshape for delivery: id=${deliveryId}`,
    );

    // Update the player's colshape state and clear help text
    if (colshapeType === "collection" && playerColshapeState.currentCollectionId === deliveryId) {
      playerColshapeState.currentCollectionId = null;
      clearHelpText();
    } else if (
      colshapeType === "delivery" &&
      playerColshapeState.currentDeliveryId === deliveryId
    ) {
      playerColshapeState.currentDeliveryId = null;
      clearHelpText();
    }
  });

  // Setup the state watcher with deep option to detect changes in nested collections
  const stateWatcher = watch(
    () => gameState.foodDelivery,
    (foodDelivery) => {
      // Check if player has active deliveries
      const hasActiveDelivery = gameState.flags.has(PlayerFlags.HasActiveDelivery);
      const activeDeliveries = foodDelivery.activeDeliveries;
      const deliveriesCount = activeDeliveries ? activeDeliveries.size : 0;

      console.log(
        `[FoodDelivery] State updated: has deliveries=${hasActiveDelivery}, count=${deliveriesCount}`,
      );

      if (hasActiveDelivery) {
        // Get all active deliveries
        if (activeDeliveries && activeDeliveries.size > 0) {
          updateDeliveryUI(activeDeliveries);

          // Clean up pendingCollections for deliveries that no longer exist
          // or are now marked as collected
          for (const pendingId of pendingCollections) {
            const delivery = activeDeliveries.get(pendingId);
            if (!delivery || delivery.isCollected) {
              pendingCollections.delete(pendingId);
            }
          }
        }
      } else {
        // Player has no deliveries, clear everything
        clearAllBlips();
        clearAllMarkers();
        clearAllColshapes();
        clearAllDeliveryTimers();
        pendingCollections.clear();

        // Reset active points
        playerColshapeState.currentCollectionId = null;
        playerColshapeState.currentDeliveryId = null;
      }
    },
    { deep: true },
  );

  // Additional watcher specifically for the activeDeliveries map
  const deliveriesWatcher = watchEffect(() => {
    const activeDeliveries = gameState.foodDelivery.activeDeliveries;
    if (activeDeliveries && activeDeliveries.size > 0) {
      // Log any changes in active deliveries for debugging
      console.log(`[FoodDelivery] Deliveries watchEffect: count=${activeDeliveries.size}`);
      updateDeliveryUI(activeDeliveries);
    }
  });

  // We no longer need the proximity check interval since we're using colshapes

  /**
   * Update all UI elements based on current active deliveries
   */
  function updateDeliveryUI(activeDeliveries: Map<number, any>): void {
    // Get current delivery IDs
    const currentDeliveryIds = new Set(Array.from(activeDeliveries.keys()));

    // Remove UI for deliveries that are no longer active
    for (const deliveryId of [...activeBlips.keys()]) {
      if (!currentDeliveryIds.has(deliveryId)) {
        removeDeliveryUI(deliveryId);
      }
    }

    // Add UI for new deliveries
    for (const [deliveryId, deliveryData] of activeDeliveries.entries()) {
      // Check if this is a new delivery (doesn't have UI yet)
      if (!activeBlips.has(deliveryId)) {
        console.log(
          `[FoodDelivery] Creating new delivery UI: id=${deliveryId}, isPrivateHome=${deliveryData.isPrivateHome}`,
        );

        createDeliveryUI(
          deliveryId,
          deliveryData.collectionPoint,
          deliveryData.deliveryPoint,
          deliveryData.isPrivateHome,
          deliveryData.isCollected,
        );

        // Set up timer if it doesn't exist
        if (!deliveryTimers.has(deliveryId)) {
          const elapsedTime = Date.now() - deliveryData.startTime;
          const remainingTime = Math.max(0, deliveryData.timeLimit - elapsedTime);
          setupDeliveryTimer(deliveryId, remainingTime);
        }
      } else {
        // Update existing delivery UI based on state changes
        updateDeliveryMarkers(deliveryId, deliveryData);
      }
    }
  }

  /**
   * Determine which delivery the player should focus on
   */
  function determineFocusedDelivery(activeDeliveries: Map<number, any>): number | null {
    // If we already have a focused delivery and it's still active, keep it
    if (currentFocusedDelivery !== null && activeDeliveries.has(currentFocusedDelivery)) {
      const delivery = activeDeliveries.get(currentFocusedDelivery);
      // If delivery is collected or in progress, keep it as focused
      if (delivery.isCollected) {
        return currentFocusedDelivery;
      }
    }

    // Otherwise look for a collected delivery (one that's already in progress)
    for (const [deliveryId, delivery] of activeDeliveries.entries()) {
      if (delivery.isCollected) {
        return deliveryId;
      }
    }

    // If no collected deliveries, use the first uncollected one
    for (const [deliveryId] of activeDeliveries.entries()) {
      return deliveryId;
    }

    return null;
  }

  /**
   * Create blips and markers for collection and delivery points
   */
  function createDeliveryUI(
    deliveryId: number,
    collectionPoint: { x: number; y: number; z: number },
    deliveryPoint: { x: number; y: number; z: number },
    isPrivateHome: boolean,
    isCollected: boolean,
  ): void {
    try {
      // Assign a consistent color for this delivery if it doesn't have one
      if (!deliveryColors.has(deliveryId)) {
        // Use the deliveryId to choose a color (wrapping around if needed)
        const colorIndex = deliveryId % DELIVERY_COLORS.length;
        deliveryColors.set(deliveryId, DELIVERY_COLORS[colorIndex]);
      }

      const deliveryColor = deliveryColors.get(deliveryId)!;

      // Create collection point blip
      const collectionBlip = alt.PointBlip.create({
        pos: collectionPoint,
      });
      collectionBlip.sprite = BLIP_COLLECTION_SPRITE;
      collectionBlip.color = deliveryColor;
      collectionBlip.name = `Food Pickup #${deliveryId}`;

      // Create delivery point blip
      const deliveryBlip = alt.PointBlip.create({
        pos: deliveryPoint,
      });
      deliveryBlip.sprite = isPrivateHome ? BLIP_PRIVATE_HOME_SPRITE : BLIP_DELIVERY_SPRITE;
      deliveryBlip.color = deliveryColor;
      deliveryBlip.name = isPrivateHome
        ? `Private Home Delivery #${deliveryId}`
        : `Food Delivery #${deliveryId}`;

      // Store blips
      activeBlips.set(deliveryId, { collection: collectionBlip, delivery: deliveryBlip });

      // Create markers and colshapes
      createDeliveryMarkersAndColshapes(
        deliveryId,
        collectionPoint,
        deliveryPoint,
        isCollected,
        deliveryColor,
      );

      // Determine if this delivery should get waypoint focus
      const activeDeliveries = gameState.foodDelivery.activeDeliveries;
      if (activeDeliveries) {
        // Choose which delivery to focus based on state
        const focusedDelivery = determineFocusedDelivery(activeDeliveries);

        // Set this as the focused delivery if:
        // 1. There's no focused delivery yet
        // 2. This is the chosen focused delivery and the waypoint needs updating
        if (currentFocusedDelivery === null || focusedDelivery === deliveryId) {
          currentFocusedDelivery = deliveryId;

          // Set GPS for the focused delivery
          if (!isCollected) {
            setWaypoint(collectionPoint.x, collectionPoint.y);
          } else {
            setWaypoint(deliveryPoint.x, deliveryPoint.y);
          }
        }
      }
    } catch (err) {
      console.error(
        `[FoodDelivery] Failed to create UI for delivery: id=${deliveryId}, error=${err}`,
      );
    }
  }

  /**
   * Create markers and colshapes for collection and delivery points
   */
  function createDeliveryMarkersAndColshapes(
    deliveryId: number,
    collectionPoint: { x: number; y: number; z: number },
    deliveryPoint: { x: number; y: number; z: number },
    isCollected: boolean,
    deliveryColor: alt.Enums.BlipColor,
  ): void {
    // Convert blip color to RGBA for markers
    const colorMap = {
      [alt.Enums.BlipColor.ORANGE]: new alt.RGBA(255, 165, 0, 128),
      [alt.Enums.BlipColor.BLUE]: new alt.RGBA(0, 0, 255, 128),
      [alt.Enums.BlipColor.GREEN]: new alt.RGBA(0, 255, 0, 128),
      [alt.Enums.BlipColor.PURPLE]: new alt.RGBA(128, 0, 128, 128),
      [alt.Enums.BlipColor.PINK]: new alt.RGBA(255, 0, 255, 128),
      [alt.Enums.BlipColor.YELLOW]: new alt.RGBA(255, 255, 0, 128),
      [alt.Enums.BlipColor.RED]: new alt.RGBA(255, 0, 0, 128),
      [alt.Enums.BlipColor.LIGHT_BLUE]: new alt.RGBA(0, 191, 255, 128),
    };

    const markerColor = colorMap[deliveryColor] || new alt.RGBA(255, 255, 255, 128);

    // Storage for markers and colshapes
    const markers: {
      collection?: alt.Marker;
      delivery?: alt.Marker;
    } = {};

    const colshapes: {
      collection?: alt.ColShape;
      delivery?: alt.ColShape;
    } = {};

    // Only create collection marker/colshape if not already collected
    if (!isCollected) {
      // Create collection marker
      markers.collection = alt.Marker.create({
        type: alt.Enums.MarkerType.MARKER_CYLINDER,
        pos: new alt.Vector3(collectionPoint.x, collectionPoint.y, collectionPoint.z - 1.0),
        color: markerColor,
      });

      // Create collection colshape
      const collectionColshape = alt.ColShapeCylinder.create({
        pos: new alt.Vector3(collectionPoint.x, collectionPoint.y, collectionPoint.z - 1.0),
        radius: INTERACTION_DISTANCE,
        height: 3.0,
        initialMeta: {
          meta: {
            deliveryId: deliveryId,
            colshapeType: "collection",
          },
        },
      });

      colshapes.collection = collectionColshape;
    }

    // Create delivery marker and colshape
    markers.delivery = alt.Marker.create({
      type: alt.Enums.MarkerType.MARKER_CYLINDER,
      pos: new alt.Vector3(deliveryPoint.x, deliveryPoint.y, deliveryPoint.z - 1.0),
      color: markerColor,
    });

    // Create delivery colshape
    const deliveryColshape = alt.ColShapeCylinder.create({
      pos: new alt.Vector3(deliveryPoint.x, deliveryPoint.y, deliveryPoint.z - 1.0),
      radius: INTERACTION_DISTANCE,
      height: 3.0,
      initialMeta: {
        meta: {
          deliveryId: deliveryId,
          colshapeType: "delivery",
        },
      },
    });

    colshapes.delivery = deliveryColshape;

    // Store markers and colshapes
    activeMarkers.set(deliveryId, markers);
    activeColshapes.set(deliveryId, colshapes);
  }

  /**
   * Update marker visibility based on delivery state changes
   */
  function updateDeliveryMarkers(deliveryId: number, deliveryData: any): void {
    const markers = activeMarkers.get(deliveryId);
    const colshapes = activeColshapes.get(deliveryId);
    if (!markers || !colshapes) return;

    // If food was just collected, remove collection marker and colshape
    if (deliveryData.isCollected) {
      if (markers.collection) {
        markers.collection = undefined;
      }

      if (colshapes.collection) {
        colshapes.collection.destroy();
        colshapes.collection = undefined;
      }

      activeMarkers.set(deliveryId, markers);
      activeColshapes.set(deliveryId, colshapes);

      // If the player was in the collection colshape that we just removed,
      // reset the collection state
      if (playerColshapeState.currentCollectionId === deliveryId) {
        playerColshapeState.currentCollectionId = null;
        clearHelpText();
      }
    }
  }

  /**
   * Remove UI elements for a specific delivery
   */
  function removeDeliveryUI(deliveryId: number): void {
    console.log(`[FoodDelivery] Removing delivery UI: id=${deliveryId}`);

    // Remove blips
    const blips = activeBlips.get(deliveryId);
    if (blips) {
      if (blips.collection) blips.collection.destroy();
      if (blips.delivery) blips.delivery.destroy();
      activeBlips.delete(deliveryId);
    }

    // Remove markers
    const markers = activeMarkers.get(deliveryId);
    activeMarkers.delete(deliveryId);

    // Remove colshapes
    const colshapes = activeColshapes.get(deliveryId);
    if (colshapes) {
      if (colshapes.collection) colshapes.collection.destroy();
      if (colshapes.delivery) colshapes.delivery.destroy();
      activeColshapes.delete(deliveryId);
    }

    // Remove from color map
    deliveryColors.delete(deliveryId);

    // Clear timer
    if (deliveryTimers.has(deliveryId)) {
      const timer = deliveryTimers.get(deliveryId);
      if (timer) timer.destroy();
      deliveryTimers.delete(deliveryId);
    }

    // Reset active points if they match this delivery
    if (playerColshapeState.currentCollectionId === deliveryId)
      playerColshapeState.currentCollectionId = null;
    if (playerColshapeState.currentDeliveryId === deliveryId)
      playerColshapeState.currentDeliveryId = null;

    // Reset focused delivery if this was the focused one
    if (currentFocusedDelivery === deliveryId) {
      currentFocusedDelivery = null;

      // Find a new delivery to focus on
      const activeDeliveries = gameState.foodDelivery.activeDeliveries;
      if (activeDeliveries && activeDeliveries.size > 0) {
        const newFocused = determineFocusedDelivery(activeDeliveries);
        if (newFocused !== null) {
          currentFocusedDelivery = newFocused;
          const newDelivery = activeDeliveries.get(newFocused);
          if (newDelivery) {
            if (newDelivery.isCollected) {
              setWaypoint(newDelivery.deliveryPoint.x, newDelivery.deliveryPoint.y);
            } else {
              setWaypoint(newDelivery.collectionPoint.x, newDelivery.collectionPoint.y);
            }
          }
        }
      }
    }
  }

  /**
   * Clear all blips
   */
  function clearAllBlips(): void {
    const blipCount = activeBlips.size;
    if (blipCount > 0) {
      console.log(`[FoodDelivery] Clearing all delivery blips: count=${blipCount}`);
    }

    for (const [deliveryId, blips] of activeBlips.entries()) {
      if (blips.collection) blips.collection.destroy();
      if (blips.delivery) blips.delivery.destroy();
    }
    activeBlips.clear();
  }

  /**
   * Clear all markers
   */
  function clearAllMarkers(): void {
    const markerCount = activeMarkers.size;
    if (markerCount > 0) {
      console.log(`[FoodDelivery] Clearing all delivery markers: count=${markerCount}`);
    }

    activeMarkers.clear();
  }

  /**
   * Clear all colshapes
   */
  function clearAllColshapes(): void {
    const colshapeCount = activeColshapes.size;
    if (colshapeCount > 0) {
      console.log(`[FoodDelivery] Clearing all delivery colshapes: count=${colshapeCount}`);
    }

    for (const [deliveryId, colshapes] of activeColshapes.entries()) {
      if (colshapes.collection) colshapes.collection.destroy();
      if (colshapes.delivery) colshapes.delivery.destroy();
    }
    activeColshapes.clear();
  }

  /**
   * Clear all delivery timers
   */
  function clearAllDeliveryTimers(): void {
    const timerCount = deliveryTimers.size;
    if (timerCount > 0) {
      console.log(`[FoodDelivery] Clearing all delivery timers: count=${timerCount}`);
    }

    for (const [deliveryId, timer] of deliveryTimers.entries()) {
      if (timer && typeof timer.destroy === "function") {
        timer.destroy();
      }
    }
    deliveryTimers.clear();
  }

  /**
   * Set up a timer for delivery
   */
  function setupDeliveryTimer(deliveryId: number, timeLimit: number): void {
    // Convert time limit to seconds
    const timeLimitSeconds = Math.floor(timeLimit / 1000);
    let remainingTime = timeLimitSeconds;

    console.log(
      `[FoodDelivery] Setting up timer: id=${deliveryId}, timeLimit=${Math.round(timeLimit / 1000)}s`,
    );

    // Remove existing timer if there is one
    if (deliveryTimers.has(deliveryId)) {
      const existingTimer = deliveryTimers.get(deliveryId);
      if (existingTimer) {
        existingTimer.destroy();
      }
    }

    // Start countdown
    const interval = alt.Timers.setInterval(() => {
      remainingTime--;

      if (remainingTime <= 0) {
        // Time expired
        console.log(`[FoodDelivery] Delivery time expired: id=${deliveryId}`);
        interval.destroy();
        deliveryTimers.delete(deliveryId);
        return;
      }

      // Display warning when time is getting low (30 seconds)
      if (remainingTime === 30) {
        console.log(`[FoodDelivery] Delivery time warning: id=${deliveryId}, remaining=30s`);
      }
    }, 1000);

    // Store the interval ID
    deliveryTimers.set(deliveryId, interval);
  }

  /**
   * Clear help text
   */
  function clearHelpText(): void {
    game.clearAllHelpMessages();
  }

  // Return cleanup function
  return () => {
    console.log("[FoodDelivery] Cleaning up food delivery system");

    if (keyEventHandler) {
      keyEventHandler.destroy();
    }

    if (colshapeEnterHandler) {
      colshapeEnterHandler.destroy();
    }

    if (colshapeLeaveHandler) {
      colshapeLeaveHandler.destroy();
    }

    if (stateWatcher && typeof stateWatcher === "function") {
      stateWatcher();
    }

    if (deliveriesWatcher && typeof deliveriesWatcher === "function") {
      deliveriesWatcher();
    }

    clearAllBlips();
    clearAllMarkers();
    clearAllColshapes();
    clearAllDeliveryTimers();
    pendingCollections.clear();

    // Reset active points
    playerColshapeState.currentCollectionId = null;
    playerColshapeState.currentDeliveryId = null;
  };
});

/**
 * Helper to set GPS waypoint
 */
function setWaypoint(x: number, y: number): void {
  game.setNewWaypoint(x, y);
}

/**
 * Helper function to draw a marker
 */
function drawMarker(
  type: number,
  x: number,
  y: number,
  z: number,
  scale: number,
  r: number,
  g: number,
  b: number,
  a: number,
): void {
  game.drawMarker(
    type,
    x,
    y,
    z,
    0,
    0,
    0,
    0,
    0,
    0,
    scale,
    scale,
    scale,
    r,
    g,
    b,
    a,
    false, // bobUpAndDown
    true, // faceCamera
    2, // p19
    false, // rotate
    null, // textureDict
    null, // textureName
    false, // drawOnEnts
  );
}

/**
 * Helper function to show help text
 */
function showHelpText(text: string): void {
  game.beginTextCommandDisplayHelp("STRING");
  game.addTextComponentSubstringPlayerName(text);
  game.endTextCommandDisplayHelp(0, false, true, -1);
}
