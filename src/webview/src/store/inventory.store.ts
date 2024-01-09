import { defineStore } from "pinia";
import { rpc } from "@/rpc";
import {
  EquipmentSlot,
  LocalPlayerEquipmentItemSource,
  InventoryItem,
  LocalPlayerInventoryItemSource,
  LocalPlayerItemSource,
  InteractionInventoryItemSource,
  LocalItemSource,
  ItemSource,
  InventoryItemSource,
  ShopSource,
  LocalInventoryItemSource,
} from "@shared/interfaces";
import { ServerCall } from "@shared/calls/server";
import { ComponentPublicInstance, markRaw, reactive } from "vue";
import DropItemWarning from "@/scenes/in-game/inventory/DropItemWarning.vue";
import { ClientEvents } from "@shared/events/client";
import {
  CombineType,
  Equipment,
  Item,
  createItem,
  getCombineType,
  isItemFirearmWeapon,
} from "@shared/modules/items";

import { isCharacterStoreAvailable, useCharacter } from "./synced/character.store";
import { getLocalEquipmentItem, getLocalInventoryItem, getInteractionInventoryItem } from "@/utils/items";
import { useGameState } from "./synced/game-state.store";
import { useShop } from "./shop.store";

const MOCK_ITEMS = reactive([
  {
    slot: 0,
    item: {
      key: "DLC_MP_XMAS3_M_JBIB_1_0",
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

export type SlottedInventoryItem<T = Item> = {
  item: T;
  source: LocalInventoryItemSource;
  price: number | null;
};

export type SlottedEquipmentItem<T = Item> = {
  item: T;
  source: LocalPlayerEquipmentItemSource;
};

export type SlottedPlayerInventoryItem<T = Item> = {
  item: T;
  source: LocalPlayerInventoryItemSource;
};

export type SlottedItem<S = LocalItemSource, T = Item> = S extends LocalInventoryItemSource ? SlottedInventoryItem<T> : SlottedEquipmentItem<T>;

export type SlottedEquipment = {
  [K in keyof Equipment]: SlottedItem<
    LocalPlayerEquipmentItemSource,
    NonNullable<Equipment[K]>
  > | null;
};

export function isSameSource(a: LocalItemSource, b: LocalItemSource) {
  if (!a || !b) {
    return false;
  }

  if (a.type !== b.type) {
    return false;
  }

  return (
    (a.type === "inventory" &&
      a.inventorySlot === (b as LocalPlayerInventoryItemSource).inventorySlot) ||
    (a.type === "equipment" &&
      a.equipmentSlot === (b as LocalPlayerEquipmentItemSource).equipmentSlot) ||
    (a.type === "interaction" &&
      a.inventorySlot === (b as InteractionInventoryItemSource).inventorySlot)
  );
}

type ItemSlot = { source: LocalItemSource; node: { value: HTMLElement | undefined } };

interface State {
  itemSlots: ItemSlot[];
  dropItemWarningRef?: ComponentPublicInstance<typeof DropItemWarning>;
  currentInteraction: ItemInteraction;
  selectedItem?: SlottedItem;
  draggingItemThisFrame: boolean;
  previewingItem?: SlottedItem;
}

export const useInventory = defineStore("inventory", {
  state: (): State => ({
    itemSlots: [],
    dropItemWarningRef: undefined,
    currentInteraction: IDLE,
    draggingItemThisFrame: false,
    selectedItem: undefined,
    previewingItem: undefined,
  }),
  getters: {
    character: () => {
      return useCharacter();
    },
    playerId(): string {
      return this.character.id;
    },
    interaction: () => {
      return useGameState().interaction;
    },
    size(): number {
      return this.character.inventory.size ?? 30;
    },
    items(): SlottedItem[] {
      const items: SlottedItem[] = reactive([]);

      if (!("altMock" in globalThis) && !isCharacterStoreAvailable()) {
        return items;
      }

      const inventoryItems = this.character.inventory.items.filter(Boolean);
      if ("altMock" in globalThis) {
        inventoryItems.push(...MOCK_ITEMS);
      }
      for (const inventoryItem of inventoryItems) {
        items.push(getLocalInventoryItem(inventoryItem));
      }

      const equipmentItems = Object.entries(this.character.equipment ?? {}).filter(
        ([, item]) => !!item
      ) as [EquipmentSlot, Item][];

      for (const [equipmentSlot, item] of equipmentItems) {
        items.push(getLocalEquipmentItem(item, equipmentSlot));
      }

      if (this.interaction) {
        const interactionItems = this.interaction.items;

        for (const item of interactionItems) {
          items.push(getInteractionInventoryItem(item));
        }
      }

      return items;
    },
    inventoryItems(): SlottedItem<LocalPlayerInventoryItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<LocalPlayerInventoryItemSource> =>
          item.source.type === "inventory"
      );
    },
    equipmentItems(): SlottedItem<LocalPlayerEquipmentItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<LocalPlayerEquipmentItemSource> =>
          item.source.type === "equipment"
      );
    },
    interactionItems(): SlottedItem<InteractionInventoryItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<InteractionInventoryItemSource> =>
          item.source.type === "interaction"
      );
    },
    equipment(): SlottedEquipment {
      const equipment: SlottedEquipment = {
        mask: null,
        glasses: null,
        headwear: null,
        earrings: null,
        top: null,
        armor: null,
        accessory: null,
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
    toItemSource<T extends LocalItemSource>(source: T) {
      if (source.type === "interaction") {
        return {
          type: "inventory",
          inventorySlot: source.inventorySlot,
          ...this.interaction!.source,
        } satisfies InventoryItemSource;
      }

      return {
        ...source,
        origin: "character",
        originId: this.playerId,
      } satisfies ItemSource;
    },
    useItem(source: LocalItemSource) {
      if (source.type === "equipment") {
        return;
      }
      return rpc.callServer(
        ServerCall.FromWebview.USE_ITEM,
        this.toItemSource(source) as InventoryItemSource
      );
    },
    equipItem(source: LocalItemSource) {
      if (source.type === "equipment") {
        return;
      }
      return rpc.callServer(
        ServerCall.FromWebview.EQUIP_ITEM,
        this.toItemSource(source) as InventoryItemSource
      );
    },
    unequipItem(equipmentSlot: EquipmentSlot) {
      return rpc.callServer(ServerCall.FromWebview.UNEQUIP_ITEM, equipmentSlot);
    },
    dropItem(source: LocalItemSource) {
      if (window.altMock) {
        return Promise.resolve(true);
      }
      return rpc.callServer(ServerCall.FromWebview.DROP_ITEM, this.toItemSource(source));
    },
    combineItems(weaponSource: LocalItemSource, ammoSource: LocalItemSource) {
      return rpc.callServer(
        ServerCall.FromWebview.COMBINE_ITEMS,
        this.toItemSource(weaponSource),
        this.toItemSource(ammoSource)
      );
    },
    unloadAmmo(source: LocalItemSource) {
      return rpc.callServer(ServerCall.FromWebview.UNLOAD_AMMO, this.toItemSource(source));
    },
    removeBait(source: LocalItemSource) {
      return rpc.callServer(ServerCall.FromWebview.REMOVE_BAIT, this.toItemSource(source));
    },
    swapLocally(from: SlottedItem | undefined, to: SlottedItem | LocalItemSource) {
      if (from && 'source' in to) {
        [from.source, to.source] = [to.source, from.source];
      } else if (from) {
        from.source = 'source' in to ? to.source : to;
      }
    },
    async moveItem(from: LocalItemSource, to: LocalItemSource, options: { local?: boolean; amount?: number } = {}) {
      const itemInSlotFrom = this.items.find(({ source }) => isSameSource(source, from));
      const itemInSlotTo = this.items.find(({ source }) => isSameSource(source, to));

      if (options.local) {
        this.swapLocally(itemInSlotFrom, itemInSlotTo || to);
        return true;
      }

      const sourceFrom = this.toItemSource(from);
      const sourceTo = this.toItemSource(to);

      console.log("move item", sourceFrom, sourceTo);

      if (sourceFrom.origin === "shop" && sourceTo.origin === "character" && sourceTo.type === "inventory") {
        const shop = useShop();

        shop.initiateBuying(from);
        return;
      } else if (sourceTo.origin === "shop" && sourceFrom.origin === "character" && sourceFrom.type === "inventory") {
        const shop = useShop();

        shop.initiateSelling(from);
        return;
      }

      this.swapLocally(itemInSlotFrom, itemInSlotTo || to);

      const ok = await rpc.callServer(
        ServerCall.FromWebview.MOVE_ITEM,
        sourceFrom,
        sourceTo
      );

      if (!ok) {
        this.moveItem(to, from, { local: true, amount: options.amount });
      }
      return ok;
    },
    handleMouseDown(e: MouseEvent) {
      if (e.button !== 0) {
        return;
      }

      const source = this.getItemSourceFromScreenPos(e.clientX, e.clientY);

      if (!source) {
        console.log("no source");
        return;
      }

      const item = this.getItemFromSource(source);

      if (!item) {
        console.log("no item", source, this.items);
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
          const source = this.getItemSourceFromScreenPos(e.clientX, e.clientY);

          if (!source) {
            this.currentInteraction = IDLE;
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
              : this.getItemFromSource(source);

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

        // if (
        //   this.currentInteraction.state.item.source.type === "interaction"
        // ) {
        //   this.currentInteraction = IDLE;
        //   return;
        // }

        const source = this.getItemSourceFromScreenPos(e.clientX, e.clientY);

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

      const source = this.getItemSourceFromScreenPos(e.clientX, e.clientY);

      if (!source) {
        return;
      }

      const itemInSlot = this.getItemFromSource(source);

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
    dropFromMenu(source: LocalPlayerItemSource) {
      const position = this.getItemSourceScreenPosition(source);
      const item = this.getItemFromSource(source);

      if (!item) {
        return;
      }

      this.currentInteraction = {
        type: InteractionType.Dropping,
        state: {
          item,
          position: {
            x: position.x,
            y: position.y,
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
    getItemFromSource<T extends LocalItemSource>(source: T) {
      return this.items.find((item): item is T extends LocalInventoryItemSource ? SlottedInventoryItem : SlottedEquipmentItem => isSameSource(item.source, source));
    },
    getItemSourceFromScreenPos(x: number, y: number) {
      const result = this.itemSlots
        .map(
          (slot) =>
            [
              slot.source,
              slot.node.value?.parentElement?.classList.contains("node-anchor")
                ? slot.node.value?.parentElement.getBoundingClientRect()
                : slot.node.value?.getBoundingClientRect(),
            ] as const
        )
        .find(([, rect]) => {
          return rect && x > rect.left && x <= rect.right && y > rect.top && y <= rect.bottom;
        });

      if (!result) {
        return null;
      }

      return result[0];
    },
    getItemNodeFromSource(source: LocalItemSource) {
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
    getItemRelativeScreenPositionFromSource(source: LocalItemSource) {
      const node = this.getItemNodeFromSource(source);

      if (!node) {
        return { x: 0, y: 0 };
      }
      return { x: node.offsetLeft, y: node.offsetTop };
    },
  },
});
