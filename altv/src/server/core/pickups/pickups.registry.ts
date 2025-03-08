
/**
 * Example usage:
 * 
 * ```typescript
 * import { createPickup } from '../core/pickups/pickups.registry';
 * 
 * const pickup = createPickup({
 *   pos: new alt.Vector3(0, 0, 0),
 *   size: 2,
 *   onEnter: ({ entity, pickup }) => {
 *     console.log(`Player ${entity.id} entered pickup.`);
 *     return () => {
 *       console.log(`Player ${entity.id} left pickup.`);
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

import alt from "@altv/server";
import "./pickups.colshape";
import type { OnEnterCallback } from "./pickups.colshape";

type CreatePickupOptions = alt.ColShapeCircleCreateOptions<any> & {
  onEnter?: OnEnterCallback;
};

/**
 * Represents a pickup in the game world with chainable methods for adding visual elements
 */
export class Pickup {
  public readonly colShape: alt.ColShapeCircle;

  constructor(options: CreatePickupOptions) {
    const { pos, radius, ...rest } = options;

    this.colShape = alt.ColShapeCircle.create({
      pos,
      radius,
    });

    this.colShape.pickup = this;

    for (const key in rest) {
      // @ts-expect-error - Typescript is not smart enough to know that the key is a valid property
      this.colShape[key] = rest[key];
    }

    console.log(`[Pickup] Created colShape ${this.colShape.id}`);
  }

  /**
   * Gets the marker associated with this pickup
   */
  get marker(): alt.VirtualEntity | undefined {
    return this.colShape.marker;
  }

  /**
   * Gets the blip associated with this pickup
   */
  get blip(): alt.Blip | undefined {
    return this.colShape.blip;
  }

  /**
   * Adds a blip to the pickup
   */
  addBlip(options: Parameters<typeof alt.ColShape.prototype.addBlip>[0]): Pickup {
    this.colShape.addBlip(options);
    console.log(`[Pickup] Added blip ${this.blip?.id} to colShape ${this.colShape.id}`);
    return this;
  }

  /**
   * Adds a marker to the pickup
   */
  addMarker(options: Parameters<typeof alt.ColShape.prototype.addMarker>[0]): Pickup {
    this.colShape.addMarker(options);
    console.log(`[Pickup] Added marker ${this.marker?.id} to colShape ${this.colShape.id}`);
    return this;
  }

  /**
   * Registers a callback to be executed when the player enters the pickup
   */
  whenInside(callback: ({ entity, pickup }: { entity: alt.WorldObject, pickup: Pickup }) => (() => void) | void): void {
    this.colShape.whenInside(callback);
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
