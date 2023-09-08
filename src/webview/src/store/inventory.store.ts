import { defineStore } from "pinia";
import { rpc } from "@/rpc";
import {
  EquipmentSlot,
  LocalEquipmentItemSource,
  InventoryItem,
  LocalInventoryItemSource,
  LocalItemSource,
  ItemSource,
} from "@shared/interfaces";
import { ServerCall } from "@shared/calls/server";
import { ComponentPublicInstance, markRaw, reactive } from "vue";
import DropItemWarning from "@/scenes/in-game/inventory/DropItemWarning.vue";
import { px } from "@/composables/use-pixel";
import { ClientEvents } from "@shared/events/client";
import { CombineType, Equipment, Item, createItem, getCombineType, isItemAmmo, isItemFirearmWeapon } from "@shared/modules/items";

import { useCharacter } from "./synced/character.store";
import { useGameState } from "./synced/game-state.store";

const MOCK_ITEMS = reactive([
  {
    slot: 0,
    item: {
      key: "snowball",

      amount: 50,
    },
  },
  {
    slot: 1,
    item: {
      key: "appistol",
      durability: 100,
      ammo: null,
      components: [],
      tint: 0,
    },
  },
  {
    slot: 2,
    item: {
      key: "handgunammo",
      amount: 100,
    },
  },
  {
    slot: 3,
    item: {
      key: "assaultrifleammo",
      amount: 256,
    },
  },
] as InventoryItem[]);

export type Dragging = {
  item: SlottedItem;
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
  item: SlottedItem;
  position: {
    x: number;
    y: number;
  };
  outside?: true;
};

export type Hovering = {
  item: SlottedItem;
  position: {
    x: number;
    y: number;
  };
};

export type ItemActionMenu = {
  item: SlottedItem;
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

const IDLE = { type: InteractionType.None } as const;

export type SlottedItem<S = LocalItemSource, T = Item> = {
  item: T;
  source: S;
};

export type SlottedEquipment = {
  [K in keyof Equipment]: SlottedItem<LocalEquipmentItemSource, NonNullable<Equipment[K]>> | null;
};

export function isSameSource(a: LocalItemSource, b: LocalItemSource) {
  if (!a || !b) {
    return false;
  }

  if (a.type !== b.type) {
    return false;
  }
  return (
    (a.type === "inventory" && a.inventorySlot === (b as LocalInventoryItemSource).inventorySlot) ||
    (a.type === "equipment" && a.equipmentSlot === (b as LocalEquipmentItemSource).equipmentSlot)
  );
}

type ItemSlot = { source: LocalItemSource; node: { value: HTMLElement | undefined } };

interface State {
  itemSlots: ItemSlot[];
  dropItemWarningRef?: ComponentPublicInstance<typeof DropItemWarning>;
  currentInteraction: ItemInteraction;
  selectedItem?: SlottedItem;
  draggingItemThisFrame: boolean;
}

export const useInventory = defineStore("inventory", {
  state: (): State => ({
    itemSlots: [],
    dropItemWarningRef: undefined,
    currentInteraction: IDLE,
    draggingItemThisFrame: false,
    selectedItem: undefined,
  }),
  getters: {
    character: () => {
      return useCharacter();
    },
    playerId(): string {
      return this.character.id;
    },
    size(): number {
      return this.character.inventory.size ?? 30;
    },
    items(): SlottedItem[] {
      const items: SlottedItem[] = reactive([]);

      if (!useGameState().isInGame) {
        return items;
      }

      const inventoryItems = this.character.inventory.items.filter(Boolean);
      for (const inventoryItem of inventoryItems ?? MOCK_ITEMS) {
        items.push({
          item: inventoryItem.item,
          source: {
            type: "inventory",
            inventorySlot: inventoryItem.slot,
          },
        });
      }

      const equipmentItems = Object.entries(this.character.equipment ?? {}).filter(
        ([, item]) => !!item
      ) as [EquipmentSlot, Item][];
      for (const [equipmentSlot, item] of equipmentItems) {
        items.push({
          item,
          source: {
            type: "equipment",
            equipmentSlot,
          },
        });
      }

      return items;
    },
    inventoryItems(): SlottedItem<LocalInventoryItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<LocalInventoryItemSource> => item.source.type === "inventory"
      );
    },
    equipmentItems(): SlottedItem<LocalEquipmentItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<LocalEquipmentItemSource> => item.source.type === "equipment"
      );
    },
    equipment(): SlottedEquipment {
      const equipment: SlottedEquipment = {
        mask: null,
        glasses: null,
        headwear: null,
        earrings: null,
        top: null,
        shirt: null,
        armor: null,
        neckwear: null,
        weapon: null,
        gloves: null,
        lefthand: null,
        pants: null,
        righthand: null,
        backpack: null,
        shoes: null,
        phone: null,
      };

      for (const item of this.equipmentItems) {
        const equipmentSlot = item.source.equipmentSlot;
        if (equipmentSlot === "ammo") {
          continue;
        }
        // @ts-expect-error item is guaranteed to be of correct type,
        // but TS is complaining that e.g. ClothingItem might be on weapon slot
        equipment[equipmentSlot] = item;
      }
      return equipment;
    },
  },
  actions: {
    registerItemSlot(slot: ItemSlot) {
      this.itemSlots.push(markRaw(slot));
    },
    toCharacterItemSource(source: LocalItemSource): ItemSource {
      return {
        ...source,
        source: "character",
        sourceId: this.playerId,
      } as const;
    },
    useItem(source: LocalItemSource) {
      return rpc.callServer(ServerCall.FromWebview.USE_ITEM, this.toCharacterItemSource(source));
    },
    equipItem(source: LocalItemSource) {
      return rpc.callServer(ServerCall.FromWebview.EQUIP_ITEM, this.toCharacterItemSource(source));
    },
    unequipItem(equipmentSlot: EquipmentSlot) {
      return rpc.callServer(ServerCall.FromWebview.UNEQUIP_ITEM, equipmentSlot);
    },
    dropItem(source: LocalItemSource) {
      if (window.altMock) {
        return Promise.resolve(true);
      }
      return rpc.callServer(ServerCall.FromWebview.DROP_ITEM, this.toCharacterItemSource(source));
    },
    combineItems(weaponSource: LocalItemSource, ammoSource: LocalItemSource) {
      return rpc.callServer(
        ServerCall.FromWebview.COMBINE_ITEMS,
        this.toCharacterItemSource(weaponSource),
        this.toCharacterItemSource(ammoSource)
      );
    },
    unloadAmmo(source: LocalItemSource) {
      return rpc.callServer(ServerCall.FromWebview.UNLOAD_AMMO, this.toCharacterItemSource(source));
    },
    removeBait(source: LocalItemSource) {
      return rpc.callServer(ServerCall.FromWebview.REMOVE_BAIT, this.toCharacterItemSource(source));
    },
    async moveItem(from: LocalItemSource, to: LocalItemSource, local: boolean = false) {
      const itemInSlotFrom = this.items.find(({ source }) => isSameSource(source, from));
      const itemInSlotTo = this.items.find(({ source }) => isSameSource(source, to));

      if (itemInSlotFrom && itemInSlotTo) {
        [itemInSlotFrom.source, itemInSlotTo.source] = [itemInSlotTo.source, itemInSlotFrom.source];
      } else if (itemInSlotFrom) {
        itemInSlotFrom.source = to;
      } else if (itemInSlotTo) {
        itemInSlotTo.source = from;
      }

      if (local) {
        return true;
      }

      const ok = await rpc.callServer(
        ServerCall.FromWebview.MOVE_ITEM,
        this.toCharacterItemSource(from),
        this.toCharacterItemSource(to)
      );

      if (!ok) {
        this.moveItem(to, from, true);
      }
      return ok;
    },
    handleMouseDown(e: MouseEvent) {
      if (e.button !== 0) {
        return;
      }

      const source = this.getItemSource(e.clientX, e.clientY);

      if (!source) {
        return;
      }

      const item = this.items.find((item) => isSameSource(item.source, source));

      if (!item) {
        return;
      }

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
          const source = this.getItemSource(e.clientX, e.clientY);

          if (!source) {
            return;
          }

          if (this.currentInteraction.type === InteractionType.Hovering) {
            if (isSameSource(this.currentInteraction.state.item.source, source)) {
              this.currentInteraction.state.position = { x: e.clientX, y: e.clientY };
              return;
            }
          }

          const itemInSlot =
            source.type === "equipment" && source.equipmentSlot === "ammo"
              ? (() => {
                const weapon = this.items.find((item) =>
                  isSameSource(item.source, {
                    type: "equipment",
                    equipmentSlot: "weapon",
                  })
                )?.item;

                const ammo = weapon && isItemFirearmWeapon(weapon) && weapon.ammo;

                return (
                  ammo && {
                    source,
                    item: createItem(ammo.key, {
                      amount: ammo.clip + ammo.rest,
                    }),
                  }
                );
              })()
              : this.items.find((item) => isSameSource(item.source, source));

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

        const source = this.getItemSource(e.clientX, e.clientY);

        // If the item is dropped outside of the inventory
        if (!source) {
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
          this.moveItem(this.currentInteraction.state.item.source, source);

          this.currentInteraction = IDLE;

          this.draggingItemThisFrame = true;
          requestAnimationFrame(() => {
            this.draggingItemThisFrame = false;
          });
        }
      }
    },
    handleClick(e: MouseEvent) {
      if (this.currentInteraction.type === InteractionType.ContextMenu) {
        this.selectedItem = undefined;
        return;
      }

      const source = this.getItemSource(e.clientX, e.clientY);

      if (!source) {
        return;
      }

      const itemInSlot = this.items.find((item) => isSameSource(item.source, source));

      if (!itemInSlot) {
        if (this.selectedItem) {
          this.selectedItem = undefined;
        }
        return;
      }

      if (this.selectedItem && isSameSource(itemInSlot.source, this.selectedItem.source)) {
        this.selectedItem = undefined;
        return;
      }

      if (this.selectedItem) {
        const target = itemInSlot;
        const source = this.selectedItem;

        const [combineType, reverse] = getCombineType(target.item.key, source.item.key);

        if (combineType !== CombineType.None) {
          this.selectedItem = undefined;

          this.combineItems(source.source, target.source);
        }
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

      this.selectedItem = itemInSlot;
    },
    async completeDropping() {
      if (this.currentInteraction.type !== InteractionType.Dropping) {
        return;
      }

      const source = this.currentInteraction.state.item.source;

      const shouldDrop = await this.dropItem(source);

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
    dropFromMenu(item: SlottedItem) {
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
    openContextMenu(item: SlottedItem, event: PointerEvent | MouseEvent) {
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
        this.selectedItem = undefined;
      }
    },
    getItemSource(x: number, y: number) {
      const result = this.itemSlots
        .map((slot) => [slot.source, slot.node.value?.getBoundingClientRect()] as const)
        .find(([, rect]) => {
          return (
            rect &&
            x > rect.left - px(5) &&
            x <= rect.right + px(5) &&
            y > rect.top - px(5) &&
            y <= rect.bottom + px(5)
          );
        });

      if (!result) {
        return null;
      }

      return result[0];
    },
    getItemSourceNode(source: LocalItemSource) {
      return this.itemSlots.find((slot) => isSameSource(slot.source, source))?.node.value;
    },
    getItemSourceScreenPosition(source: LocalItemSource) {
      const rect = this.itemSlots
        .find((slot) => isSameSource(slot.source, source))
        ?.node.value?.getBoundingClientRect();

      if (!rect) {
        return { x: 0, y: 0 };
      }

      return { x: rect.x, y: rect.y };
    },
  },
});
