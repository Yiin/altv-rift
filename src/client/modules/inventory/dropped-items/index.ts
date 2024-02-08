import * as alt from "@altv/client";
import _ from "lodash";
import { getItemName, isStackable } from "@shared/modules/items";
import { clientState } from "@/core/store/client.store";

alt.Timers.everyTick(() => {
  // Update the position of the dropped items
  alt.VirtualEntity.streamedIn.forEach((entity) => {
    if (entity.streamSyncedMeta.entityType !== "item") {
      return;
    }

    const name = getItemName(entity.streamSyncedMeta.item!.key);
    const amount = isStackable(entity.streamSyncedMeta.item!) ? entity.streamSyncedMeta.item!.amount : 1;
    alt.Drawing.drawText3dThisFrame(
      `${name} x ${amount}`
      , entity.pos, 0.3, 0.32, new alt.RGBA(255, 255, 255, 255), true, false);
  });
});

alt.Timers.setInterval(updateNearbyItems, 2000);

alt.Events.onWorldObjectStreamIn((entity) => {
  if (!(entity instanceof alt.VirtualEntity) || entity.streamSyncedMeta.entityType !== "item") {
    return;
  }

  updateNearbyItems();
});

alt.Events.onWorldObjectStreamOut((entity) => {
  if (!(entity instanceof alt.VirtualEntity) || entity.streamSyncedMeta.entityType !== "item") {
    return;
  }

  updateNearbyItems();
});

function updateNearbyItems() {
  // Use a Set for efficient lookup of currently processed item IDs
  const processedItemIDs = new Set();

  // Filter and update for items within 5 units of distance
  alt.VirtualEntity.streamedIn.forEach((entity) => {
    if (entity.streamSyncedMeta.entityType !== "item") {
      return;
    }

    const distance = entity.pos.distanceTo(alt.Player.local.pos);
    const isWithinRange = distance <= 5;
    const itemID = entity.remoteID;
    const alreadyListed = clientState.nearbyItems.some(item => item.id === itemID);

    if (isWithinRange && !alreadyListed) {
      // Add new nearby item
      clientState.nearbyItems.push({ item: entity.streamSyncedMeta.item!, id: itemID });
    } else if (!isWithinRange && alreadyListed) {
      // Remove item no longer nearby
      _.remove(clientState.nearbyItems, item => item.id === itemID);
    } else {
      // Update the item properties (amount, etc)
      const item = clientState.nearbyItems.find(item => item.id === itemID);
      if (item) {
        Object.assign(item.item, entity.streamSyncedMeta.item);
      }
    }

    // Mark this item ID as processed
    processedItemIDs.add(itemID);
  });

  // Remove any items that are no longer nearby
  // This step cleans up any items that might have been missed in the forEach loop
  _.remove(clientState.nearbyItems, item => !processedItemIDs.has(item.id));

  // Sort the nearbyItems by distance to the player
  clientState.nearbyItems.sort((a, b) => {
    const entityA = alt.VirtualEntity.getByRemoteID(a.id);
    const entityB = alt.VirtualEntity.getByRemoteID(b.id);
    const distanceA = entityA ? entityA.pos.distanceTo(alt.Player.local.pos) : Infinity;
    const distanceB = entityB ? entityB.pos.distanceTo(alt.Player.local.pos) : Infinity;
    return distanceA - distanceB;
  });
}
