
/**
 * Example usage:
 * 
 * ```typescript
 * import { createPickup } from '../core/pickups/pickups.registry';
 * 
 * const pickup = createPickup({
 *   pos: new alt.Vector3(0, 0, 0),
 *   size: 2,
 *   onEnter: () => {
 *     console.log('Player entered pickup!');
 *     return () => {
 *       console.log('Player left pickup!');
 *     };
 *   }
 * })
 * .addMarker({
 *   type: 1,
 *   color: new alt.RGBA(255, 0, 0, 255),
 * })
 * .addBlip({
 *   color: 1,
 *   sprite: 1,
 *   scale: 1,
 *   name: 'Pickup',
 * });
 */

import alt from "@altv/client";
import "./pickups.colshape";

type CreatePickupOptions = alt.ColShapeCylinderCreateOptions<any> & {
  onEnter?: () => (() => void) | void;
};

/**
 * Represents a pickup in the game world with chainable methods for adding visual elements
 */
export class Pickup {
  public readonly colshape: alt.ColShapeCylinder;

  constructor(options: CreatePickupOptions) {
    const { pos, radius, ...rest } = options;

    this.colshape = alt.ColShapeCylinder.create({
      pos,
      radius,
      height: 2,
    });

    for (const key in rest) {
      // @ts-expect-error - Typescript is not smart enough to know that the key is a valid property
      this.colshape[key] = rest[key];
    }

    console.log("created colShape", this.colshape.id);
  }

  /**
   * Gets the marker associated with this pickup
   */
  get marker(): alt.Marker | undefined {
    return this.colshape.marker;
  }

  /**
   * Gets the blip associated with this pickup
   */
  get blip(): alt.Blip | undefined {
    return this.colshape.blip;
  }

  /**
   * Adds a blip to the pickup
   */
  addBlip(options: Parameters<typeof alt.ColShape.prototype.addBlip>[0]): Pickup {
    this.colshape.addBlip(options);
    console.log("added blip", this.blip?.id);
    return this;
  }

  /**
   * Adds a marker to the pickup
   */
  addMarker(options: Parameters<typeof alt.ColShape.prototype.addMarker>[0]): Pickup {
    this.colshape.addMarker(options);
    console.log("added marker", this.marker?.id);
    return this;
  }

  /**
   * Registers a callback to be executed when the player enters the pickup
   */
  whenInside(callback: () => (() => void) | void): void {
    this.colshape.whenInside(callback);
  }

  /**
   * Destroys the pickup
   */
  destroy(): void {
    // blip and marker are automatically destroyed when the colshape is destroyed
    this.colshape.destroy();
  }
}

/**
 * Creates a pickup at the specified position with the given size.
 * Returns a pickup object with chainable methods for adding markers and blips.
 */
export function createPickup(options: CreatePickupOptions): Pickup {
  const pickup = new Pickup(options);

  if (options.onEnter) {
    pickup.whenInside(options.onEnter);
  }

  return pickup;
}
