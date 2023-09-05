import { getScreenResolution } from "@/utility/screen-resolution";
import { AnchorEntity } from "../types";

let focusedEntity: AnchorEntity | null = null;
let closestDistance: number = Number.MAX_SAFE_INTEGER;

export function resetFocusedEntity() {
  focusedEntity = null;
  closestDistance = Number.MAX_SAFE_INTEGER;
}

export function updateFocusedEntity(
  entity: AnchorEntity,
  distanceToCenter: number
) {
  if (
    distanceToCenter < getScreenResolution().x / 8 &&
    distanceToCenter < closestDistance
  ) {
    focusedEntity = entity;
    closestDistance = distanceToCenter;
  }
}

export function getFocusedEntity() {
  if (closestDistance < Number.MAX_SAFE_INTEGER) {
    return focusedEntity;
  }
  return null;
}

export function getFocusedEntityDistance() {
  return closestDistance;
}
