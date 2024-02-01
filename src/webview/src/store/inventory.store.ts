import { defineStore } from "pinia";
import { rpc } from "@/rpc";
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
import { useGameState } from "./synced/game-state.store";
import { useShop } from "./shop.store";
import { useClient } from "./synced/client.store";
import {
  EquipmentSlot,
  GroundItemSource,
  InteractionInventoryItemSource,
  InventoryItem,
  InventoryItemSource,
  ItemSource,
  ItemSourceOrigin,
  PlayerEquipmentItemSource,
  PlayerInventoryItemSource,
  PlayerItemSource,
} from "@shared/interfaces";

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
  {
    slot: 2,
    item: {
      key: "handgunammo",
      amount: 100,
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

export type SlottedPlayerInventoryItem<T = Item> = {
  item: T;
  source: PlayerInventoryItemSource;
};

export type SlottedEquipmentItem<T = Item> = {
  item: T;
  source: PlayerEquipmentItemSource;
};

export type SlottedGroundItem<T = Item> = {
  item: T;
  source: GroundItemSource;
};

export type SlottedInteractionInventoryItem<T = Item> = {
  item: T;
  source: InteractionInventoryItemSource;
  price: number | null;
};

export type SlottedItem<S = ItemSource, T = Item> =
  // player inventory
  S extends PlayerInventoryItemSource
  ? SlottedPlayerInventoryItem<T>
  : // player equipment
  S extends PlayerEquipmentItemSource
  ? SlottedEquipmentItem<T>
  : // nearby items
  S extends GroundItemSource
  ? SlottedGroundItem<T>
  : // opened storage
  S extends InteractionInventoryItemSource
  ? SlottedInteractionInventoryItem<T>
  : never;

export type SlottedEquipment = {
  [K in keyof Equipment]: SlottedItem<PlayerEquipmentItemSource, NonNullable<Equipment[K]>> | null;
};

export function isSameItemSource<A extends ItemSource, B extends ItemSource>(
  a?: A,
  b?: B
): a is A & B {
  if (!a || !b) {
    return false;
  }

  if (a.origin !== b.origin) {
    return false;
  }

  if (a.originId !== b.originId) {
    return false;
  }

  return (
    (a.origin === ItemSourceOrigin.PlayerInventory &&
      a.inventorySlot === (b as PlayerInventoryItemSource).inventorySlot) ||
    (a.origin === ItemSourceOrigin.PlayerEquipment &&
      a.equipmentSlot === (b as PlayerEquipmentItemSource).equipmentSlot) ||
    a.origin === ItemSourceOrigin.Ground ||
    (a.origin === ItemSourceOrigin.InteractionInventory &&
      b.origin === ItemSourceOrigin.InteractionInventory &&
      a.inventorySlot === (b as InteractionInventoryItemSource).inventorySlot)
  );
}

type ItemNode = { source: ItemSource; node: { value: HTMLElement | undefined } };

interface State {
  itemNodes: ItemNode[];
  dropItemWarningRef?: ComponentPublicInstance<typeof DropItemWarning>;
  currentInteraction: ItemInteraction;
  selectedItem?: SlottedItem;
  draggingItemThisFrame: boolean;
  previewingItem?: SlottedItem;
}

export const useInventory = defineStore("inventory", {
  state: (): State => ({
    itemNodes: [],
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
      return useGameState().interactionInventory;
    },
    nearbyItems: () => {
      return useClient().nearbyItems;
    },
    size(): number {
      return this.character.inventory.size ?? 30;
    },
    items(): SlottedItem[] {
      const items: SlottedItem[] = reactive([]);

      if (!("altMock" in globalThis) && !isCharacterStoreAvailable()) {
        return items;
      }

      /**
       * Player inventory
       */
      const inventoryItems = this.character.inventory.items.filter(Boolean);
      if ("altMock" in globalThis) {
        inventoryItems.push(...MOCK_ITEMS);
      }
      for (const inventoryItem of inventoryItems) {
        items.push({
          item: inventoryItem.item,
          price: inventoryItem.price,
          source: {
            origin: ItemSourceOrigin.PlayerInventory,
            originId: this.playerId,
            inventorySlot: inventoryItem.slot,
          } satisfies PlayerInventoryItemSource,
        });
      }

      /**
       * Player equipment
       */
      const equipmentItems = Object.entries(this.character.equipment ?? {}).filter(
        ([, item]) => !!item
      ) as [EquipmentSlot, Item][];

      for (const [equipmentSlot, item] of equipmentItems) {
        items.push({
          item,
          source: {
            origin: ItemSourceOrigin.PlayerEquipment,
            originId: this.playerId,
            equipmentSlot,
          } satisfies PlayerEquipmentItemSource,
        });
      }

      /**
       * Opened storage inventory
       */
      if (this.interaction) {
        const interactionItems = this.interaction.items;

        for (const item of interactionItems) {
          items.push({
            item: item.item,
            price: item.price,
            source: {
              ...this.interaction.source,
              inventorySlot: item.slot,
            } satisfies InteractionInventoryItemSource,
          });
        }
      }

      /**
       * Nearby items
       */
      for (const groundItem of this.nearbyItems) {
        items.push(groundItem);
      }

      return items;
    },
    inventoryItems(): SlottedItem<PlayerInventoryItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<PlayerInventoryItemSource> =>
          item.source.origin === ItemSourceOrigin.PlayerInventory
      );
    },
    equipmentItems(): SlottedItem<PlayerEquipmentItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<PlayerEquipmentItemSource> =>
          item.source.origin === ItemSourceOrigin.PlayerEquipment
      );
    },
    interactionItems(): SlottedItem<InteractionInventoryItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<InteractionInventoryItemSource> =>
          item.source.origin === ItemSourceOrigin.InteractionInventory
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
    registerItemSlot(slot: ItemNode) {
      this.itemNodes.push(markRaw(slot));
    },
    useItem(source: InventoryItemSource) {
      return rpc.callServer(ServerCall.FromWebview.USE_ITEM, source);
    },
    equipItem(source: InventoryItemSource) {
      return rpc.callServer(ServerCall.FromWebview.EQUIP_ITEM, source);
    },
    unequipItem(equipmentSlot: EquipmentSlot) {
      return rpc.callServer(ServerCall.FromWebview.UNEQUIP_ITEM, equipmentSlot);
    },
    dropItem(source: PlayerItemSource, amount: number) {
      if (window.altMock) {
        return Promise.resolve(true);
      }

      return rpc.callServer(ServerCall.FromWebview.DROP_ITEM, source, amount);
    },
    combineItems(weaponSource: ItemSource, ammoSource: ItemSource) {
      return rpc.callServer(ServerCall.FromWebview.COMBINE_ITEMS, weaponSource, ammoSource);
    },
    unloadAmmo(source: ItemSource) {
      return rpc.callServer(ServerCall.FromWebview.UNLOAD_AMMO, source);
    },
    removeBait(source: ItemSource) {
      return rpc.callServer(ServerCall.FromWebview.REMOVE_BAIT, source);
    },
    swapLocally(from: SlottedItem | undefined, to: SlottedItem | ItemSource) {
      if (from && "source" in to) {
        [from.source, to.source] = [to.source, from.source];
      } else if (from) {
        from.source = "source" in to ? to.source : to;
      }
    },
    async moveItem(
      from: ItemSource,
      to: ItemSource,
      options: { local?: boolean; amount?: number } = {}
    ) {
      const itemInSlotFrom = this.items.find(({ source }) => isSameItemSource(source, from));
      const itemInSlotTo = this.items.find(({ source }) => isSameItemSource(source, to));

      if (options.local) {
        this.swapLocally(itemInSlotFrom, itemInSlotTo || to);
        return true;
      }

      console.log("move item", from, to, options.amount ?? 1);

      const isInShop = useShop().isInShop;

      if (isInShop) {
        if (
          from.origin === ItemSourceOrigin.InteractionInventory &&
          to.origin === ItemSourceOrigin.PlayerInventory
        ) {
          const shop = useShop();

          shop.initiateBuying(from);
          return;
        } else if (
          from.origin === ItemSourceOrigin.PlayerInventory &&
          to.origin === ItemSourceOrigin.InteractionInventory
        ) {
          const shop = useShop();

          shop.initiateSelling(from);
          return;
        }
      }

      this.swapLocally(itemInSlotFrom, itemInSlotTo || to);

      const ok = await rpc.callServer(ServerCall.FromWebview.MOVE_ITEM, from, to, options.amount);

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
            if (isSameItemSource(this.currentInteraction.state.item.source, source)) {
              this.currentInteraction.state.position = { x: e.clientX, y: e.clientY };
              return;
            }
          }

          const itemInSlot =
            source.origin === ItemSourceOrigin.PlayerEquipment && source.equipmentSlot === "ammo"
              ? (() => {
                const weapon = this.items.find((item) =>
                  isSameItemSource(item.source, {
                    origin: ItemSourceOrigin.PlayerEquipment,
                    originId: this.playerId,
                    equipmentSlot: EquipmentSlot.Weapon,
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
          // @ts-expect-error TODO: Ask for amount
          foo = 4;

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

      if (this.selectedItem && isSameItemSource(itemInSlot.source, this.selectedItem.source)) {
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
    async completeDropping(amount: number) {
      if (this.currentInteraction.type !== InteractionType.Dropping) {
        return;
      }

      const source = this.currentInteraction.state.item.source;

      if (
        source.origin !== ItemSourceOrigin.PlayerEquipment &&
        source.origin !== ItemSourceOrigin.PlayerInventory
      ) {
        this.currentInteraction = IDLE;
        return;
      }

      const shouldDrop = await this.dropItem(source, amount);

      if (!shouldDrop) {
        this.currentInteraction = IDLE;
        return;
      }

      setTimeout(() => {
        if (this.currentInteraction?.type === InteractionType.Dropping) {
          this.currentInteraction = IDLE;
        }
      }, 100);
    },
    dropFromMenu(source: PlayerItemSource) {
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

      console.log("open context menu", item, event.clientX, event.clientY);

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
    getItemFromSource<T extends ItemSource>(source: T) {
      return this.items.find((item): item is SlottedItem<T> =>
        isSameItemSource(item.source, source)
      );
    },
    getItemSourceFromScreenPos(x: number, y: number) {
      const MAX_DISTANCE = 8;

      const distanceToRect = (rect: DOMRect, x: number, y: number): number => {
        const dx = x - Math.max(rect.left, Math.min(x, rect.right));
        const dy = y - Math.max(rect.top, Math.min(y, rect.bottom));
        return Math.sqrt(dx * dx + dy * dy);
      };

      const closest = this.itemNodes
        .map((slot) => {
          const rect = slot.node.value?.parentElement?.classList.contains("node-anchor")
            ? slot.node.value?.parentElement.getBoundingClientRect()
            : slot.node.value?.getBoundingClientRect();

          return rect ? ([slot.source, rect, distanceToRect(rect, x, y)] as const) : null;
        })
        .filter(
          (entry): entry is NonNullable<typeof entry> => entry !== null && entry[2] <= MAX_DISTANCE
        )
        .sort((a, b) => a[2] - b[2])[0];

      return closest ? closest[0] : null;
    },
    getItemNodeFromSource(source: ItemSource) {
      const slot = this.itemNodes.find((slot) => isSameItemSource(slot.source, source));
      return slot?.node.value;
    },
    getItemSourceScreenPosition(source: ItemSource) {
      const rect = this.itemNodes
        .find((slot) => isSameItemSource(slot.source, source))
        ?.node.value?.getBoundingClientRect();

      if (!rect) {
        return { x: 0, y: 0 };
      }

      return { x: rect.x, y: rect.y };
    },
    getItemRelativeScreenPositionFromSource(source: ItemSource) {
      const node = this.getItemNodeFromSource(source);

      if (!node) {
        return { x: 0, y: 0 };
      }
      return { x: node.offsetLeft, y: node.offsetTop };
    },
  },
});
