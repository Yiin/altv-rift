import alt from "alt-client";
import game from "natives";
import { Raw, markRaw, ref, watch } from "vue";
import { getScreenResolution } from "@/core/utility/screen-resolution";
import { AnchorEntity } from "../types";

let entityToFocus: AnchorEntity | null = null;
let closestDistance: number = Number.MAX_SAFE_INTEGER;
const currentlyFocusedEntity = ref<Raw<AnchorEntity> | null>(null);

watch(currentlyFocusedEntity, (entity) => {
  game.setPedCanSwitchWeapon(alt.Player.local, entity === null);
});

export function resetFocusedEntity() {
  entityToFocus = null;
  closestDistance = Number.MAX_SAFE_INTEGER;
}

export function updateFocusedEntity(entity: AnchorEntity, distanceToCenter: number) {
  if (distanceToCenter < getScreenResolution().x / 8 && distanceToCenter < closestDistance) {
    entityToFocus = entity;
    closestDistance = distanceToCenter;
  }
}

export function getFocusedEntity() {
  if (entityToFocus !== currentlyFocusedEntity.value) {
    currentlyFocusedEntity.value = entityToFocus ? markRaw(entityToFocus) : null;
  }
  if (closestDistance < Number.MAX_SAFE_INTEGER) {
    return currentlyFocusedEntity.value;
  }
  return null;
}

export function getFocusedEntityDistance() {
  return closestDistance;
}
