import alt from "@altv/server";
import { HomeDeliveryPoint } from "@shared/store/game-state.store";

// Calculate distance-based bonus for private homes
export function calculatePrivateHomeBonus(
  collectionPoint: alt.IVector3,
  deliveryPoint: HomeDeliveryPoint,
) {
  // Create a Vector3 from the delivery point position
  const deliveryPos = new alt.Vector3(deliveryPoint.pos);

  // Use alt.Vector3's built-in distance calculation
  const distance = deliveryPos.distanceTo(collectionPoint);

  // Base bonus factor + additional bonus based on distance
  // For every 500 units of distance, add 10% bonus
  const distanceBonus = (distance / 500) * 0.1;
  const totalBonus = 1.2 + distanceBonus; // Base 20% bonus + distance bonus

  return totalBonus;
}
