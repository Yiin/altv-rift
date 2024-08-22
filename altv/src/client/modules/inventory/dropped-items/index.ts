import alt from "@altv/client";
import _ from "lodash";
import { Item, ItemGrade, getItemName, isStackable } from "@shared/modules/items";
import { VirtualEntityType } from "@shared/interfaces";
import { clientState } from "@/core/store/client.store";

// Update the nearby items periodically, so the ordering by distance is updated
alt.Timers.setInterval(updateNearbyItems, 2000);

alt.Font.register("client/core/rmlui/fonts/jost/Jost-Regular.ttf");

const labels = new Map<alt.VirtualEntity, alt.TextLabel>();

alt.Events.onWorldObjectStreamIn(({ object }) => {
  if (
    !(object instanceof alt.VirtualEntity) ||
    object.streamSyncedMeta.entityType !== VirtualEntityType.Item
  ) {
    return;
  }

  const item = object.streamSyncedMeta.item!;
  const amount = isStackable(item) ? item.amount : 1;

  const label = alt.TextLabel.create({
    fontName: "Jost",
    text: `${getItemName(item.key)} x ${amount}`,
    color:
      "grade" in item
        ? {
          [ItemGrade.COMMON]: new alt.RGBA(255, 255, 255, 255),
          [ItemGrade.UNCOMMON]: new alt.RGBA(185, 240, 69, 255),
          [ItemGrade.RARE]: new alt.RGBA(32, 135, 255, 255),
          [ItemGrade.EPIC]: new alt.RGBA(187, 44, 255, 255),
          [ItemGrade.LEGENDARY]: new alt.RGBA(255, 218, 87, 255),
          [ItemGrade.CONTRABAND]: new alt.RGBA(255, 218, 87, 255),
          [ItemGrade.LIMITED]: new alt.RGBA(0, 255, 234, 255),
        }[item.grade]
        : new alt.RGBA(255, 255, 255, 255),
    pos: object.pos,
    fontSize: 32,
    fontScale: 1,
    outlineColor: new alt.RGBA(0, 0, 0, 255),
    outlineWidth: 1,
  })!;

  label.faceCamera = true;

  labels.set(object, label);

  updateNearbyItems();
});

alt.Events.onWorldObjectStreamOut(({ object }) => {
  if (
    !(object instanceof alt.VirtualEntity) ||
    object.streamSyncedMeta.entityType !== VirtualEntityType.Item
  ) {
    return;
  }

  labels.get(object)?.destroy();

  updateNearbyItems();
});

alt.Events.onStreamSyncedMetaChange(({ entity, key, newValue }) => {
  if (
    !(entity instanceof alt.VirtualEntity) ||
    entity.streamSyncedMeta.entityType !== VirtualEntityType.Item
  ) {
    return;
  }

  if (key !== "item") {
    return;
  }

  const item = newValue as Item | undefined;

  if (!item) {
    labels.get(entity)?.destroy();
    return;
  }

  const amount = isStackable(item) ? item.amount : 1;

  labels.get(entity)!.text = `${getItemName(item.key)} x ${amount}`;

  updateNearbyItems();
});

function updateNearbyItems() {
  const processedItemIDs = new Set();

  const DISTANCE_TO_REACH = 5;

  // Filter and update for items within the distance
  alt.VirtualEntity.streamedIn.forEach((entity) => {
    if (entity.streamSyncedMeta.entityType !== VirtualEntityType.Item) {
      return;
    }

    const distance = entity.pos.distanceTo(alt.Player.local.pos);
    const isWithinRange = distance <= DISTANCE_TO_REACH;
    const itemID = entity.remoteID;
    const alreadyListed = clientState.nearbyItems.some((item) => item.id === itemID);

    if (isWithinRange && !alreadyListed) {
      // Add new nearby item
      clientState.nearbyItems.push({ item: entity.streamSyncedMeta.item!, id: itemID });
    } else if (!isWithinRange && alreadyListed) {
      // Remove item no longer nearby
      _.remove(clientState.nearbyItems, (item) => item.id === itemID);
    } else {
      // Update the item properties (amount, etc)
      const item = clientState.nearbyItems.find((item) => item.id === itemID);
      if (item) {
        Object.assign(item.item, entity.streamSyncedMeta.item);
      }
    }

    processedItemIDs.add(itemID);
  });

  // Remove any items that are no longer nearby
  // This step cleans up any items that might have been missed in the forEach loop
  const removedItems = _.remove(clientState.nearbyItems, (item) => !processedItemIDs.has(item.id));

  // Sort the nearbyItems by distance to the player
  clientState.nearbyItems.sort((a, b) => {
    const entityA = alt.VirtualEntity.getByRemoteID(a.id);
    const entityB = alt.VirtualEntity.getByRemoteID(b.id);
    const distanceA = entityA ? entityA.pos.distanceTo(alt.Player.local.pos) : Infinity;
    const distanceB = entityB ? entityB.pos.distanceTo(alt.Player.local.pos) : Infinity;
    return distanceA - distanceB;
  });
}
