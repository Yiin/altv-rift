
import alt from "@altv/client";

declare module "@altv/client" {
  interface ColShape {
    blip?: alt.Blip;
    marker?: alt.Marker;
    addBlip(this: ColShape, options: Partial<WritablePropertiesOf<alt.Blip>> & Omit<(alt.PointBlipCreateOptions), 'pos'>): alt.Blip;
    addMarker(this: ColShape, options: Partial<WritablePropertiesOf<alt.Marker>> & Omit<alt.MarkerCreateOptions, "pos">): alt.Marker;
    whenInside(this: ColShape, callback: () => (() => void) | void): void;
  }
}

// Track colshapes that have a callback registered
const whenInside: WeakMap<alt.ColShape, (() => (() => void) | void)[]> = new WeakMap();

// Track cleanup functions for each colshape and callback
const cleanupFunctions: WeakMap<alt.ColShape, Map<() => (() => void) | void, () => void>> = new WeakMap();

// Keep the original prototype extensions for backward compatibility
alt.ColShape.prototype.addBlip = function ({ pos, ...rest }) {
  const blip = alt.PointBlip.create({
    pos: pos ?? this.pos,
  });

  for (const key in rest) {
    // @ts-expect-error - Typescript is not smart enough to know that the key is a valid property
    blip[key] = rest[key];
  }

  this.blip = blip;

  return blip;
}

alt.ColShape.prototype.addMarker = function ({ pos, type, color, useStreaming, streamingDistance, initialMeta, ...rest }) {
  const marker = alt.Marker.create({
    pos: pos ?? this.pos,
    type,
    color,
    useStreaming,
    streamingDistance,
    initialMeta,
  });

  if ('radius' in this) {
    const colShape = this as alt.ColShapeCylinder;
    marker.scale = new alt.Vector3(colShape.radius ?? 1, colShape.radius ?? 1, colShape.height ?? 1);
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

alt.ColShape.prototype.whenInside = function (callback: () => () => void) {
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
alt.Events.onColShapeEvent(({ entity, state, colShape }) => {
  if (entity instanceof alt.Player) {
    console.log("colshape event", colShape.id, entity.id, state);
    const callbacks = whenInside.get(colShape);
    if (!callbacks) return;
    console.log("callbacks", callbacks.length);

    if (state) {
      console.log("player entered colshape", colShape.id);
      // Player entered the colshape
      if (!cleanupFunctions.has(colShape)) {
        cleanupFunctions.set(colShape, new Map());
      }

      // Execute all callbacks for this colshape and store their cleanup functions
      for (const callback of callbacks) {
        const cleanup = callback();
        if (cleanup) {
          cleanupFunctions.get(colShape)!.set(callback, cleanup);
        }
      }
    } else {
      console.log("player left colshape", colShape.id);
      // Player left the colshape
      const colshapeCleanupMap = cleanupFunctions.get(colShape);
      if (!colshapeCleanupMap) return;

      // Execute and remove all cleanup functions for this colshape
      for (const [callback, cleanup] of colshapeCleanupMap.entries()) {
        cleanup();
        colshapeCleanupMap.delete(callback);
      }
    }
  }
});

alt.Events.onBaseObjectRemove(({ object }) => {
  if (object instanceof alt.ColShape) {
    // Execute cleanup functions when the colshape is removed
    const colshapeCleanupMap = cleanupFunctions.get(object);
    if (colshapeCleanupMap) {
      for (const cleanup of colshapeCleanupMap.values()) {
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
