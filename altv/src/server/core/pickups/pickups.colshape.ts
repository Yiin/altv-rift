
import alt from "@altv/server";
import { Pickup } from "./pickups.registry";
import { VirtualEntityType } from "@shared/interfaces";

export type OnEnterCallback = ({ entity, pickup }: { entity: alt.WorldObject; pickup: Pickup }) => (() => void) | void;

declare module "@altv/server" {
  interface ColShape {
    pickup?: Pickup;
    blip?: alt.Blip;
    marker?: alt.VirtualEntity;
    addBlip(this: ColShape, options: Partial<WritablePropertiesOf<alt.Blip>> & Omit<(alt.PointBlipCreateOptions & alt.SharedBlipCreateOptions), 'pos'>): alt.Blip;
    addMarker(this: ColShape, options: Partial<WritablePropertiesOf<alt.Marker>> & Omit<alt.MarkerCreateOptions, "pos">): alt.VirtualEntity;
    whenInside(this: ColShape, callback: OnEnterCallback): void;
  }
}

// Track colshapes that have a callback registered
const whenInside: WeakMap<alt.ColShape, OnEnterCallback[]> = new WeakMap();

// Track cleanup functions for each colshape and callback
const cleanupFunctions: WeakMap<alt.ColShape, Map<OnEnterCallback, () => void>> = new WeakMap();

const markerVirtualEntityGroup = alt.VirtualEntityGroup.create({
  maxEntitiesInStream: 50
});

// Keep the original prototype extensions for backward compatibility
alt.ColShape.prototype.addBlip = function ({ pos, entity, global, targets, blipType, initialMeta, ...rest }) {
  const blip = alt.PointBlip.create({
    pos: pos ?? this.pos,
    global,
    targets,
    blipType,
    initialMeta,
  });

  for (const key in rest) {
    // @ts-expect-error - Typescript is not smart enough to know that the key is a valid property
    blip[key] = rest[key];
  }

  this.blip = blip;

  return blip;
}

alt.ColShape.prototype.addMarker = function ({ target, pos, type, color, initialMeta, ...rest }) {
  console.log(`[Pickups] Adding marker to colshape ${this.id} at ${JSON.stringify(pos)} ?? ${JSON.stringify(this.pos)}`);
  const marker = alt.VirtualEntity.create({
    group: markerVirtualEntityGroup,
    pos: pos ?? this.pos,
    streamingDistance: 50,
    data: {
      entityType: VirtualEntityType.Marker,
      target,
      type,
      color,
      initialMeta,
    }
  });

  if ('radius' in this) {
    const colShape = this as alt.ColShapeCylinder;
    marker.streamSyncedMeta.scale = new alt.Vector3(colShape.radius ?? 1, colShape.radius ?? 1, colShape.height ?? 1);
  }

  for (const key in rest) {
    // @ts-expect-error - Typescript is not smart enough to know that the key is a valid property
    marker[key] = rest[key];
  }

  this.marker = marker;

  return marker;
}

/**
 * This should work like this:
 * 
 * colShape.whenInside(() => {
 *   // do something when player enters the colshape
 *   return () => {
 *     // do something when player leaves the colshape
 *   }
 * })
 */

alt.ColShape.prototype.whenInside = function (callback: OnEnterCallback) {
  // Initialize the arrays if they don't exist yet
  if (!whenInside.has(this)) {
    whenInside.set(this, []);
  }
  if (!cleanupFunctions.has(this)) {
    cleanupFunctions.set(this, new Map());
  }

  // Add the callback to the list
  whenInside.get(this)!.push(callback);
}

// @ts-expect-error - invalid type, it should be colShape not target
alt.Events.onColShapeEvent(({ entity, state, colShape, ...rest }) => {
  if (!colShape.pickup) {
    return;
  }

  const callbacks = whenInside.get(colShape);
  if (!callbacks) {
    return;
  }

  if (state) {
    // Player entered the colshape
    if (!cleanupFunctions.has(colShape)) {
      cleanupFunctions.set(colShape, new Map());
    }

    // Execute all callbacks for this colshape and store their cleanup functions
    for (const callback of callbacks) {
      const cleanup = callback({ entity, pickup: colShape.pickup });
      if (cleanup) {
        cleanupFunctions.get(colShape)!.set(callback, cleanup);
      }
    }
  } else {
    // Player left the colshape
    const colshapeCleanupMap = cleanupFunctions.get(colShape);
    if (!colshapeCleanupMap) return;

    // Execute and remove all cleanup functions for this colshape
    for (const [callback, cleanup] of colshapeCleanupMap.entries()) {
      cleanup();
      colshapeCleanupMap.delete(callback);
    }
  }
});

alt.Events.onBaseObjectRemove(({ object }) => {
  if (object instanceof alt.ColShape) {
    // Execute cleanup functions when the colshape is removed
    const colShapeCleanupMap = cleanupFunctions.get(object);
    if (colShapeCleanupMap) {
      for (const cleanup of colShapeCleanupMap.values()) {
        cleanup();
      }
      cleanupFunctions.delete(object);
    }

    // Remove the colshape from the whenInside map
    whenInside.delete(object);

    // Clean up blip and marker
    if (object.blip) {
      object.blip.destroy();
    }

    if (object.marker) {
      object.marker.destroy();
    }
  }
});
