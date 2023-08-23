import { defineStore } from "pinia";
import { usePlayerStore } from "@shared/store/player.store";
import { rpc } from "@/rpc";
import { Equipment, InventoryItem } from "@shared/interfaces";
import { ClientCall } from "@shared/calls/client";
import { ServerCall } from "@shared/calls/server";
import { ComponentPublicInstance, ComputedRef, reactive, Ref, ref, shallowRef, toRaw } from "vue";
import DropItemWarning from "@/scenes/in-game/inventory/DropItemWarning.vue";
import { px } from "@/composables/use-pixel";
import { ClientEvents } from "@shared/events/client";

const MOCK_ITEMS = reactive([
  {
    slot: 0,
    data: {
      key: "snowball",
      type: "WEAPON",
      WEAPON: {
        durability: 100,
        ammo: null,
        components: [],
        tints: [],
      },
    },
  },
  {
    slot: 1,
    data: {
      key: "appistol",
      type: "WEAPON",
      WEAPON: {
        durability: 100,
        ammo: null,
        components: [],
        tints: [],
      },
    },
  },
  {
    slot: 2,
    data: {
      key: "handgunammo",
      type: "AMMO",
      AMMO: {
        amount: 100,
      },
    },
  },
] as InventoryItem[]);

export type Dragging = {
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

export type Dropping = {
  item: InventoryItem;
  position: {
    x: number;
    y: number;
  };
  outside?: true;
};

export type Hovering = {
  item: InventoryItem;
  position: {
    x: number;
    y: number;
  };
};

export type ItemActionMenu = {
  item: InventoryItem;
  x: number;
  y: number;
  ts: number;
};

export enum InteractionType {
  None = "None",
  Dragging = "Dragging",
  Dropping = "Dropping",
  Hovering = "Hovering",
  ContextMenu = "ContextMenu",
}

export type ItemInteraction =
  | { type: InteractionType.None }
  | {
      type: InteractionType.Dragging;
      maybe: boolean;
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
      type: InteractionType.ContextMenu;
      state: ItemActionMenu;
    };

interface State {
  inventoryItemRefs: HTMLElement[];
  dropItemWarningRef?: ComponentPublicInstance<typeof DropItemWarning>;
  currentInteraction: ItemInteraction;
  selectedItem?: InventoryItem;
  draggingItemThisFrame: boolean;
}

const IDLE = { type: InteractionType.None } as const;

export const useInventory = defineStore("inventory", {
  state: (): State => ({
    inventoryItemRefs: [],
    dropItemWarningRef: undefined,
    currentInteraction: IDLE,
    draggingItemThisFrame: false,
    selectedItem: undefined,
  }),
  getters: {
    size: () => {
      return usePlayerStore().character?.inventory.size ?? 30;
    },
    items: () => {
      return (usePlayerStore().character?.inventory.items.filter(Boolean) ??
        MOCK_ITEMS) as InventoryItem[];
    },
  },
  actions: {
    useItem(slot: number) {
      return rpc.callClient(ClientCall.FromWebview.USE_ITEM, slot);
    },
    equipItem(slot: number) {
      return rpc.callClient(ClientCall.FromWebview.EQUIP_ITEM, slot);
    },
    unequipItem(equipmentSlot: keyof Equipment) {
      return rpc.callClient(ClientCall.FromWebview.UNEQUIP_ITEM, equipmentSlot);
    },
    dropItem(slot: number) {
      if (window.altMock) {
        return Promise.resolve(true);
      }
      return rpc.callClient(ClientCall.FromWebview.DROP_ITEM, slot);
    },
    async moveItem(from: number, to: number, local: boolean = false) {
      const itemInSlotFrom = this.items.find(({ slot }) => {
        return slot === from;
      });
      const itemInSlotTo = this.items.find(({ slot }) => {
        return slot === to;
      });
      if (itemInSlotFrom && itemInSlotTo) {
        [itemInSlotFrom.slot, itemInSlotTo.slot] = [itemInSlotTo.slot, itemInSlotFrom.slot];
      } else if (itemInSlotFrom) {
        itemInSlotFrom.slot = to;
      } else if (itemInSlotTo) {
        itemInSlotTo.slot = from;
      }

      if (local) {
        return true;
      }

      const ok = await rpc.callServer(ServerCall.FromWebview.MOVE_ITEM, from, to);

      if (!ok) {
        this.moveItem(to, from, true);
      }
      return ok;
    },
    handleMouseDown(e: MouseEvent) {
      if (e.button !== 0) {
        return;
      }

      const slot = this.getItemSlot(e);

      if (slot === -1) {
        return;
      }

      const item = this.items.find((item) => item.slot === slot)!;

      this.currentInteraction = {
        type: InteractionType.Dragging,
        maybe: true,
        state: {
          item,
          startPosition: { x: e.clientX, y: e.clientY },
          currentPosition: { x: e.clientX, y: e.clientY },
        },
      };
    },
    handleMouseMove(e: MouseEvent) {
      if (
        this.currentInteraction.type === InteractionType.Dragging &&
        this.currentInteraction.maybe
      ) {
        if (
          this.currentInteraction.state.startPosition.x !== e.clientX ||
          this.currentInteraction.state.startPosition.y !== e.clientY
        ) {
          alt.emit(ClientEvents.FromWebview.PLAY_SOUND, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET");

          this.currentInteraction.maybe = false;
          this.selectedItem = undefined;
        }
      }
      switch (this.currentInteraction.type) {
        case InteractionType.Dragging:
          this.currentInteraction.state.currentPosition = {
            x: e.clientX,
            y: e.clientY,
          };
          return;
        case InteractionType.Hovering:
        case InteractionType.None:
          const slot = this.getItemSlot(e);

          const itemInSlot = this.items.find((item) => item.slot === slot);

          if (!itemInSlot) {
            this.currentInteraction = IDLE;
            return;
          }

          this.currentInteraction = {
            type: InteractionType.Hovering,
            state: {
              item: itemInSlot,
              position: { x: e.clientX, y: e.clientY },
            },
          };
      }
    },
    async handleMouseUp(e: MouseEvent) {
      if (this.currentInteraction.type === InteractionType.Dragging) {
        if (this.currentInteraction.maybe) {
          this.currentInteraction = IDLE;
          return;
        }

        const slot = this.getItemSlot(e);

        // If the item is dropped outside of the inventory
        if (slot === -1) {
          this.currentInteraction = {
            type: InteractionType.Dropping,
            state: {
              item: this.currentInteraction.state.item,
              position: {
                x: window.innerWidth,
                y: window.innerHeight,
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
            if (this.currentInteraction.type !== InteractionType.Dropping) {
              return;
            }

            const rects = this.dropItemWarningRef?.$el.getBoundingClientRect();

            this.currentInteraction.state.position = {
              x: e.clientX - (rects?.width ?? 0) / 2,
              y: e.clientY - (rects?.height ?? 0) / 2,
            };
          });
        } else {
          // Move the item or swap with another item
          this.moveItem(this.currentInteraction.state.item.slot, slot);

          this.currentInteraction = IDLE;

          this.draggingItemThisFrame = true;
          requestAnimationFrame(() => {
            this.draggingItemThisFrame = false;
          });
        }
      }
    },
    handleClick(e: MouseEvent) {
      const slot = this.getItemSlot(e);
      const itemInSlot = this.items.find((item) => item.slot === slot);

      if (!itemInSlot) {
        if (this.selectedItem) {
          this.selectedItem = undefined;
        }
        return;
      }

      if (this.currentInteraction.type === InteractionType.Dragging || this.draggingItemThisFrame) {
        return;
      }

      if (
        this.currentInteraction.type !== InteractionType.None &&
        this.currentInteraction.type !== InteractionType.Hovering
      ) {
        this.currentInteraction = IDLE;
      }

      if (this.selectedItem && toRaw(this.selectedItem) === itemInSlot) {
        this.selectedItem = undefined;
        return;
      }
      this.selectedItem = itemInSlot;
    },
    async completeDropping() {
      if (this.currentInteraction.type !== InteractionType.Dropping) {
        return;
      }

      const slot = this.currentInteraction.state.item.slot ?? -1;

      if (slot < 0) {
        return;
      }

      const shouldDrop = await this.dropItem(slot);

      if (shouldDrop) {
        setTimeout(() => {
          if (this.currentInteraction?.type === InteractionType.Dropping) {
            this.currentInteraction = IDLE;
          }
        }, 100);
      } else {
        this.currentInteraction = IDLE;
      }
    },
    dropFromMenu(item: InventoryItem) {
      if (this.currentInteraction.type !== InteractionType.ContextMenu) {
        return;
      }

      this.currentInteraction = {
        type: InteractionType.Dropping,
        state: {
          item,
          position: {
            x: this.currentInteraction.state.x,
            y: this.currentInteraction.state.y,
          },
        },
      };
    },
    cancelDropping() {
      if (this.currentInteraction.type === InteractionType.Dropping) {
        this.currentInteraction = IDLE;
      }
    },
    openActionMenu(item: any, event: PointerEvent | MouseEvent) {
      if ([InteractionType.Dropping]?.includes(this.currentInteraction.type)) {
        return;
      }

      this.currentInteraction = {
        type: InteractionType.ContextMenu,
        state: { item, x: event.clientX, y: event.clientY, ts: Date.now() },
      };
    },
    closeActionMenu() {
      if (this.currentInteraction.type === InteractionType.ContextMenu) {
        this.currentInteraction = IDLE;
      }
    },
    getItemSlot(e: MouseEvent | PointerEvent) {
      const rects = this.inventoryItemRefs?.map((ref) => ref.getBoundingClientRect());

      if (!rects) {
        return -1;
      }

      const x = e.clientX;
      const y = e.clientY;

      const index = rects.findIndex((rect) => {
        return (
          x > rect.left - px(5) &&
          x <= rect.right + px(5) &&
          y > rect.top - px(5) &&
          y <= rect.bottom + px(5)
        );
      });

      return index;
    },
    getItemSlotScreenPosition(slot: number) {
      const rect = this.inventoryItemRefs[slot]?.getBoundingClientRect();

      if (!rect) {
        return { x: 0, y: 0 };
      }

      return { x: rect.x, y: rect.y };
    },
  },
});
