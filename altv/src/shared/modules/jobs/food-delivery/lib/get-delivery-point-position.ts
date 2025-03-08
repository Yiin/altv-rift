import alt from "@altv/shared";
import { PlayerDelivery, DeliveryPoint } from "@shared/store/game-state.store";

export function getDeliveryPointPosition(delivery: PlayerDelivery | DeliveryPoint): alt.IVector3 {
  if ('deliveryPoint' in delivery) {
    if ('pos' in delivery.deliveryPoint) {
      return delivery.deliveryPoint.pos;
    }
    return delivery.deliveryPoint;
  }
  if ('pos' in delivery) {
    return delivery.pos;
  }
  return delivery;
}
