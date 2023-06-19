import { format } from "date-fns";
import DropItemWarning from "@/scenes/in-game/inventory/DropItemWarning.vue";
import { InventoryItem } from "@shared/interfaces";
import { ComponentPublicInstance, ComputedRef, Ref, ref, toRaw } from "vue";
import { useEventListener } from "./use-event-listener";
import { usePixel } from "./use-pixel";
import { useWindowSize } from "./use-window-size";
import { ClientEvents } from "@shared/events/client";

type Dragging = {
  item: InventoryItem;
  startPosition: {
    x: number;
    y: number;
  };
  currentPosition: {
    x: number;
    y: number;
  };
};

type Dropping = {
  item: InventoryItem;
  position: {
    x: number;
    y: number;
  };
  outside?: true;
};

type Hovering = {
  item: InventoryItem;
  position: {
    x: number;
    y: number;
  };
};

type ItemActionMenu = {
  item: InventoryItem;
  x: number;
  y: number;
};

type Selecting = {
  item: InventoryItem;
};

type UseItemInteractionsArgs = {
  items: Ref<InventoryItem[]> | ComputedRef<InventoryItem[]>;
  itemSlotRefs: Ref<HTMLElement[]>;
  dropItemWarningRef: Ref<
    ComponentPublicInstance<typeof DropItemWarning> | undefined
  >;
  moveItem: (from: number, to: number) => Promise<boolean>;
  dropItem: (index: number) => Promise<boolean>;
};

export enum InteractionType {
  Dragging = "Dragging",
  Dropping = "Dropping",
  Hovering = "Hovering",
  ActionMenu = "ActionMenu",
}

export type ItemInteraction =
  | {
      type: InteractionType.Dragging;
      state: Dragging;
    }
  | {
      type: InteractionType.Dropping;
      state: Dropping;
    }
  | {
      type: InteractionType.Hovering;
      state: Hovering;
    }
  | {
      type: InteractionType.ActionMenu;
      state: ItemActionMenu;
    };

export const useItemInteractions = ({
  items,
  itemSlotRefs,
  dropItemWarningRef,
  moveItem,
  dropItem,
}: UseItemInteractionsArgs) => {
  const windowSize = useWindowSize();
  const px = usePixel();

  const currentInteraction = ref<ItemInteraction>();
  const preparedDragInteraction = ref<Dragging>();
  const selectedItem = ref<Selecting>();
  const draggingItemThisFrame = ref(false);

  const log = ref<string[]>([]);

  useEventListener("mousemove", handleMouseMove);
  useEventListener("mouseup", handleMouseUp);
  useEventListener("click", handleClick, true);

  function getItemSlot(e: MouseEvent | PointerEvent) {
    const rects = itemSlotRefs.value.map((ref) => ref.getBoundingClientRect());

    const x = e.clientX;
    const y = e.clientY;

    const index = rects.findIndex((rect) => {
      return (
        x >= rect.left - px(4) &&
        x <= rect.right + px(4) &&
        y >= rect.top - px(4) &&
        y <= rect.bottom + px(4)
      );
    });

    return index;
  }

  function handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) {
      return;
    }

    const slot = getItemSlot(e);

    if (slot === -1) {
      return;
    }

    const item = items.value.find((item) => item.slot === slot)!;

    pushLog(`Mouse down on item ${item.data.key}`);

    preparedDragInteraction.value = {
      item,
      startPosition: { x: e.clientX, y: e.clientY },
      currentPosition: { x: e.clientX, y: e.clientY },
    };
  }

  function handleMouseMove(e: MouseEvent) {
    if (preparedDragInteraction.value) {
      if (
        preparedDragInteraction.value.startPosition.x !== e.clientX ||
        preparedDragInteraction.value.startPosition.y !== e.clientY
      ) {
        alt.emit(
          ClientEvents.FromWebview.PLAY_SOUND,
          "SELECT",
          "HUD_FRONTEND_DEFAULT_SOUNDSET"
        );

        pushLog(`Dragging item ${preparedDragInteraction.value.item.data.key}`);
        currentInteraction.value = {
          type: InteractionType.Dragging,
          state: preparedDragInteraction.value,
        };
        selectedItem.value = undefined;
        preparedDragInteraction.value = undefined;
      }
    }
    switch (currentInteraction.value?.type) {
      case InteractionType.Dragging:
        currentInteraction.value.state.currentPosition = {
          x: e.clientX,
          y: e.clientY,
        };
        return;
      case InteractionType.Hovering:
      case undefined:
        const slot = getItemSlot(e);

        const itemInSlot = items.value.find((item) => item.slot === slot)!;

        if (!itemInSlot) {
          currentInteraction.value = undefined;
          return;
        }

        currentInteraction.value = {
          type: InteractionType.Hovering,
          state: {
            item: itemInSlot,
            position: { x: e.clientX, y: e.clientY },
          },
        };
    }
  }

  async function handleMouseUp(e: MouseEvent) {
    preparedDragInteraction.value = undefined;
    pushLog("Mouse up");

    if (currentInteraction.value?.type === InteractionType.Dragging) {
      const slot = getItemSlot(e);

      // If the item is dropped outside of the inventory
      if (slot === -1) {
        pushLog(
          `Dropping item ${currentInteraction.value.state.item.data.key} outside of inventory`
        );
        currentInteraction.value = {
          type: InteractionType.Dropping,
          state: {
            item: currentInteraction.value.state.item,
            position: {
              x: windowSize.width,
              y: windowSize.height,
            },
            outside: true,
          },
        };

        /**
         * Wait for the next frame to get the correct size of the drop item warning,
         * so we can position it correctly
         */
        requestAnimationFrame(() => {
          // Sanity check to make sure nothing changed in the span of 1 frame
          if (currentInteraction.value?.type !== InteractionType.Dropping) {
            return;
          }

          const rects = dropItemWarningRef.value?.$el.getBoundingClientRect();

          currentInteraction.value.state.position = {
            x: e.clientX - (rects?.width ?? 0) / 2,
            y: e.clientY - (rects?.height ?? 0) / 2,
          };
        });
      } else {
        pushLog(
          `Moving item ${currentInteraction.value.state.item.data.key} into slot ${slot}`
        );
        // Move the item or swap with another item
        moveItem(currentInteraction.value.state.item.slot, slot);

        currentInteraction.value = undefined;

        draggingItemThisFrame.value = true;
        requestAnimationFrame(() => {
          draggingItemThisFrame.value = false;
        });
      }
    }
  }

  async function completeDropping() {
    const slot = currentInteraction.value?.state.item.slot ?? -1;

    if (slot < 0) {
      return;
    }

    const shouldDrop = await dropItem(slot);

    pushLog(`Dropping item ${slot} ${shouldDrop ? "confirmed" : "canceled"}`);
    if (shouldDrop) {
      setTimeout(() => {
        if (currentInteraction.value?.type === InteractionType.Dropping) {
          currentInteraction.value = undefined;
        }
      }, 100);
    } else {
      currentInteraction.value = undefined;
    }
  }

  const dropFromMenu = (item: InventoryItem) => {
    if (
      !currentInteraction.value ||
      currentInteraction.value.type !== InteractionType.ActionMenu
    ) {
      return;
    }

    pushLog(`Dropping item ${item.data.key} from action menu`);
    currentInteraction.value = {
      type: InteractionType.Dropping,
      state: {
        item,
        position: {
          x: currentInteraction.value.state.x,
          y: currentInteraction.value.state.y,
        },
      },
    };
  };

  function cancelDropping() {
    if (currentInteraction.value?.type === InteractionType.Dropping) {
      pushLog(
        `Dropping item ${currentInteraction.value.state.item.data.key} canceled`
      );
      currentInteraction.value = undefined;
    }
  }

  function openActionMenu(item: any, event: PointerEvent | MouseEvent) {
    if ([InteractionType.Dropping]?.includes(currentInteraction.value?.type!)) {
      return;
    }
    pushLog(`Opening action menu for item ${item.data.key}`);
    currentInteraction.value = {
      type: InteractionType.ActionMenu,
      state: { item, x: event.clientX, y: event.clientY },
    };
  }

  function closeActionMenu() {
    if (currentInteraction.value?.type === InteractionType.ActionMenu) {
      pushLog(`Closing action menu`);
      currentInteraction.value = undefined;
    }
  }

  function handleClick(e: MouseEvent) {
    pushLog("Click");
    const slot = getItemSlot(e);
    const itemInSlot = items.value.find((item) => item.slot === slot);

    if (!itemInSlot) {
      if (selectedItem.value) {
        pushLog(
          `Cancelling selection of item ${selectedItem.value.item.data.key}`
        );
        selectedItem.value = undefined;
      }
      return;
    }

    if (
      currentInteraction.value?.type === InteractionType.Dragging ||
      draggingItemThisFrame.value
    ) {
      return;
    }

    if (
      currentInteraction.value?.type &&
      currentInteraction.value.type !== InteractionType.Hovering
    ) {
      pushLog(
        `Cancelling ${currentInteraction.value.type} because we clicked on item`
      );
      currentInteraction.value = undefined;
    }

    if (selectedItem.value && toRaw(selectedItem.value.item) === itemInSlot) {
      pushLog(`Cancelling selection of item in slot ${slot}`);
      selectedItem.value = undefined;
      return;
    }
    pushLog(`Selecting item in slot ${slot}`);
    selectedItem.value = { item: itemInSlot };
  }

  function pushLog(message: string) {
    if (window.altMock) {
      console.log(`${format(Date.now(), "hh:mm:ss")}: ${message}`);
    } else {
      log.value.push(`${format(Date.now(), "hh:mm:ss")}: ${message}`);
    }
  }

  return {
    currentInteraction,
    handleMouseDown,
    completeDropping,
    dropFromMenu,
    cancelDropping,
    openActionMenu,
    closeActionMenu,
    selectedItem,
    log,
  };
};
