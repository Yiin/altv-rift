import { watchEffect } from "vue";
import { ClientEvents } from "@shared/events/client";
import { ItemSourceOrigin, type PlayerItemSource } from "@shared/interfaces";
import { isStackable, getCombineType, CombineType } from "@shared/modules/items";
import { transferAmount, dropItem, moveItem, combineItems } from "./inventory.actions";
import {
  clearCurrentInventoryInteraction,
  clearSelectedItem,
  getAmmunitionPanelRef,
  getCurrentInventoryInteraction,
  getSelectedItem,
  isDraggingItemThisFrame,
  setCurrentInventoryInteraction,
  setDraggingItemThisFrame,
  setSelectedItem,
} from "./inventory.state";
import { InventoryInteractionType } from "./inventory.types";
import {
  getItemFromSource,
  getItemNodeFromSource,
  getItemSourceFromScreenPos,
  isSameItemSource,
  isSameSourceOrigin,
} from "./inventory.utils";

export function handleInventoryMouseDown(e: MouseEvent) {
  if (e.button !== 0) {
    return;
  }

  if (getAmmunitionPanelRef()?.contains(e.target as HTMLElement)) {
    return;
  }

  const source = getItemSourceFromScreenPos(e.clientX, e.clientY);

  if (!source) {
    return;
  }

  const node = getItemNodeFromSource(source);

  if (!node) {
    return;
  }

  if (!(node.contains(e.target as HTMLElement) || (e.target as HTMLElement).contains(node))) {
    return;
  }

  const item = getItemFromSource(source);

  if (!item) {
    return;
  }

  setCurrentInventoryInteraction({
    type: InventoryInteractionType.Dragging,
    maybe: true,
    state: {
      item,
      startPosition: { x: e.clientX, y: e.clientY },
      currentPosition: { x: e.clientX, y: e.clientY },
    },
  });
}

export function handleInventoryMouseMove(e: MouseEvent) {
  const currentInteraction = getCurrentInventoryInteraction();

  if (currentInteraction.type === InventoryInteractionType.Dragging && currentInteraction.maybe) {
    if (
      currentInteraction.state.startPosition.x !== e.clientX ||
      currentInteraction.state.startPosition.y !== e.clientY
    ) {
      alt.emit(ClientEvents.FromWebview.PLAY_SOUND, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET");

      currentInteraction.maybe = false;
      clearSelectedItem();
      undefined;
    }
  }
  switch (currentInteraction.type) {
    case InventoryInteractionType.Dragging:
      currentInteraction.state.currentPosition.x = e.clientX;
      currentInteraction.state.currentPosition.y = e.clientY;
      return;
    case InventoryInteractionType.Hovering:
    case InventoryInteractionType.None:
      const source = getItemSourceFromScreenPos(e.clientX, e.clientY);

      if (!source) {
        clearCurrentInventoryInteraction();
        return;
      }

      if (currentInteraction.type === InventoryInteractionType.Hovering) {
        if (isSameItemSource(currentInteraction.state.item.source, source)) {
          currentInteraction.state.position.x = e.clientX;
          currentInteraction.state.position.y = e.clientY;
          return;
        }
      }

      const itemInSlot = getItemFromSource(source);

      if (!itemInSlot) {
        clearCurrentInventoryInteraction();
        return;
      }

      setCurrentInventoryInteraction({
        type: InventoryInteractionType.Hovering,
        state: {
          item: itemInSlot,
          position: { x: e.clientX, y: e.clientY },
        },
      });
  }
}

export async function handleInventoryMouseUp(e: MouseEvent) {
  const currentInteraction = getCurrentInventoryInteraction();

  /**
   * We were dragging an item and now we're dropping it somewhere
   */
  if (currentInteraction.type === InventoryInteractionType.Dragging) {
    if (currentInteraction.maybe) {
      // We clicked on the item but didn't move it, handleInventoryClick will handle this
      clearCurrentInventoryInteraction();
      return;
    }

    const movedItem = currentInteraction.state.item;
    const fromSource = movedItem.source;
    const toSource = getItemSourceFromScreenPos(e.clientX, e.clientY);

    const isFromGroundToGround =
      fromSource.origin === ItemSourceOrigin.Ground && toSource.origin === ItemSourceOrigin.Ground;

    // moving items from ground to ground doesn't make sense from inventory UI point of view
    const canMoveItem = !isFromGroundToGround;
    const fullAmount = isStackable(movedItem.item) ? movedItem.item.amount : 1;

    let itemMovePromise;

    if (canMoveItem) {
      try {
        /**
         * Is same origin applies when we're moving items in the same source
         * or when we're moving items between inventory and equipment
         */
        const isSameOrigin =
          isSameSourceOrigin(fromSource, toSource) ||
          [fromSource, toSource].every((s) =>
            [ItemSourceOrigin.PlayerEquipment, ItemSourceOrigin.PlayerInventory].includes(s.origin),
          );
        const isFromGround = fromSource.origin === ItemSourceOrigin.Ground;
        const isSingleItem = !isStackable(movedItem.item) || movedItem.item.amount === 1;

        const amount =
          isSameOrigin || (isFromGround && isSingleItem)
            ? // move full amount because we don't split items in the same origin
              fullAmount
            : // ask for amount to move
              await transferAmount(fromSource, toSource, { x: e.clientX, y: e.clientY });

        // if we're dropping the item on the ground
        if (!toSource || toSource.origin === ItemSourceOrigin.Ground) {
          // we can drop it only from either inventory or equipment
          if (
            [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.PlayerEquipment].includes(
              fromSource.origin,
            )
          ) {
            await dropItem(fromSource as PlayerItemSource, amount);
          } else {
            // we can't drop items from storage or other sources
            itemMovePromise = Promise.resolve(false);
          }
        } else {
          // Move the item or swap with another item
          itemMovePromise = moveItem(fromSource, toSource, { amount });
        }
      } catch {
        // couldn't move the item, oh well ¯\_(ツ)_/¯
        itemMovePromise = Promise.resolve(false);
      }
    }

    if (fromSource.origin === ItemSourceOrigin.Ground && !isFromGroundToGround) {
      // fixes item icon appearing back on the ground for a brief moment
      // after picking it up
      const stopWatching = watchEffect(() => {
        const item = getItemFromSource(fromSource);
        const currentInteraction = getCurrentInventoryInteraction();

        // check if item either doesn't exist anymore or its amount decreased
        if (!item || ("amount" in item.item && item.item.amount < fullAmount)) {
          if (
            // if we haven't changed the interaction yet, clear it
            currentInteraction.type === InventoryInteractionType.Dragging ||
            currentInteraction.type === InventoryInteractionType.TransferingAmount
          ) {
            clearCurrentInventoryInteraction();
          }
          stopWatching();
        }
      });

      // fallback if the item wasn't picked up
      itemMovePromise?.then((result) => {
        if (!result) {
          if (currentInteraction.type === InventoryInteractionType.Dragging) {
            clearCurrentInventoryInteraction();
          }
          stopWatching();
        }
      });
    } else {
      clearCurrentInventoryInteraction();
    }

    // ?? i forgor why this exists
    setDraggingItemThisFrame(true);
    requestAnimationFrame(() => {
      setDraggingItemThisFrame(false);
    });
  }
}

export function handleInventoryClick(e: MouseEvent) {
  const currentInteraction = getCurrentInventoryInteraction();

  if (currentInteraction.type === InventoryInteractionType.ContextMenu) {
    clearSelectedItem();
    return;
  }

  if (currentInteraction.type === InventoryInteractionType.AmmunitionPanel) {
    return;
  }

  const source = getItemSourceFromScreenPos(e.clientX, e.clientY);

  if (!source) {
    return;
  }

  const node = getItemNodeFromSource(source);

  if (!node) {
    return;
  }

  if (!(node.contains(e.target as HTMLElement) || (e.target as HTMLElement).contains(node))) {
    return;
  }

  const itemInSlot = getItemFromSource(source);

  if (!itemInSlot) {
    clearSelectedItem();
    return;
  }

  const selectedItem = getSelectedItem();

  if (selectedItem && isSameItemSource(itemInSlot.source, selectedItem.source)) {
    clearSelectedItem();
    return;
  }

  if (selectedItem) {
    const target = itemInSlot;
    const source = selectedItem;

    const [combineType] = getCombineType(target.item.key, source.item.key);

    if (combineType !== CombineType.None) {
      clearSelectedItem();

      combineItems(source.source, target.source);
    }
  }

  if (currentInteraction.type === InventoryInteractionType.Dragging || isDraggingItemThisFrame()) {
    return;
  }

  if (
    currentInteraction.type !== InventoryInteractionType.None &&
    currentInteraction.type !== InventoryInteractionType.Hovering
  ) {
    clearCurrentInventoryInteraction();
  }

  setSelectedItem(itemInSlot);
}
