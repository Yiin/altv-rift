import alt from "@altv/client";
import game from "@altv/natives";
import { Raw, markRaw, ref, watch } from "vue";
import { VirtualEntityType } from "@shared/interfaces";
import { getScreenResolution } from "@/core/utility/screen-resolution";
import { AnchorEntity } from "../types";
import { isInConversation } from "@/modules/questing/conversation";
import { getAnchorType } from "../element-updater";
import { focusableElements } from "../element-registry";
import { AnchorType } from "../anchors";
import { isInventoryFull } from "@shared/modules/inventory";
import { useCharacter } from "@/core/store/character.store";

let entityToFocus: AnchorEntity | null = null;
let closestDistance: number = Number.MAX_SAFE_INTEGER;
const currentlyFocusedEntity = ref<Raw<AnchorEntity> | null>(null);

watch(currentlyFocusedEntity, (entity) => {
  game.setPedCanSwitchWeapon(alt.Player.local, entity === null);
});

export function resetFocusedEntity(): void {
  if (
    isInConversation() &&
    entityToFocus &&
    entityToFocus.pos.distanceTo(alt.Player.local.pos) < 5
  ) {
    return;
  }

  entityToFocus = null;
  closestDistance = Number.MAX_SAFE_INTEGER;
}

export function updateFocusedEntity(entity: AnchorEntity, distanceToCenter: number): void {
  if (isInConversation()) {
    return;
  }

  if (!isEntityFocusable(entity)) {
    return;
  }

  if (distanceToCenter < getScreenResolution().x / 8 && distanceToCenter < closestDistance) {
    entityToFocus = entity;
    closestDistance = distanceToCenter;
  }
}

function isEntityFocusable(entity: AnchorEntity): boolean {
  if (!entity.valid) {
    return false;
  }

  const anchorType = getAnchorType(entity);

  if (!anchorType) {
    return false;
  }

  // Special case for peds, they need to have interactions to be focusable.
  if (entity.type === alt.Enums.BaseObjectType.PED) {
    return !!(entity as alt.Ped).interactions?.value.length;
  }

  // Special case for dropped items, we need to have space in inventory to interact with them.
  if (anchorType === AnchorType.DroppedItem) {
    return !isInventoryFull(useCharacter().inventory);
  }

  return focusableElements.has(anchorType);
}

export function getFocusedEntity(): Raw<AnchorEntity> | null {
  if (entityToFocus !== currentlyFocusedEntity.value) {
    currentlyFocusedEntity.value = entityToFocus ? markRaw(entityToFocus) : null;
  }
  if (closestDistance < Number.MAX_SAFE_INTEGER) {
    return currentlyFocusedEntity.value;
  }
  return null;
}

export function getFocusedEntityDistance(): number {
  return closestDistance;
}
