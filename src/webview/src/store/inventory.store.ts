import { defineStore } from "pinia";
import { rpc } from "@/rpc";
import { ServerCall } from "@shared/calls/server";
import { ComponentPublicInstance, markRaw, reactive, toRaw } from "vue";
import { ClientEvents } from "@shared/events/client";
import {
  CombineType,
  Equipment,
  Item,
  getCombineType,
  isStackable,
} from "@shared/modules/items";

import { isCharacterStoreAvailable, useCharacter } from "./synced/character.store";
import { useGameState } from "./synced/game-state.store";
import { useClient } from "./synced/client.store";
import {
  EquipmentSlot,
  GroundItemSource,
  StorageItemSource,
  InventoryItem,
  InventoryItemSource,
  ItemSource,
  ItemSourceOrigin,
  PlayerEquipmentItemSource,
  PlayerInventoryItemSource,
  PlayerItemSource,
} from "@shared/interfaces";
import { Ref } from "vue";

const MOCK_ITEMS = reactive([
  {
    slot: 0,
    item: {
      key: "DLC_MP_XMAS3_M_JBIB_1_0",
    },
  },
  {
    slot: 4,
    item: {
      key: "appistol",
      durability: 100,
      ammo: null,
      components: [],
      tint: 0,
    },
  },
  {
    slot: 3,
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

export type TransferingAmount = {
  item: SlottedItem;
  to?: ItemSource | null;
  resolve: (amount: number) => void;
  reject: () => void;
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
  TransferingAmount = "TransferingAmount",
  Hovering = "Hovering",
  ContextMenu = "ContextMenu",
  AmmunitionPanel = "AmmunitionPanel",
}

export type ItemInteraction =
  | { type: InteractionType.None }
  | {
    type: InteractionType.Dragging;
    maybe: boolean;
    state: Dragging;
  }
  | {
    type: InteractionType.TransferingAmount;
    state: TransferingAmount;
  }
  | {
    type: InteractionType.Hovering;
    state: Hovering;
  }
  | {
    type: InteractionType.ContextMenu;
    state: ItemActionMenu;
  } | {
    type: InteractionType.AmmunitionPanel;
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

export type SlottedStorageItem<T = Item> = {
  item: T;
  source: StorageItemSource;
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
  S extends StorageItemSource
  ? SlottedStorageItem<T>
  : never;

export type SlottedEquipment = {
  [K in keyof Equipment]: SlottedItem<PlayerEquipmentItemSource, NonNullable<Equipment[K]>> | null;
};

export function fromItemSource(source: ItemSource) {
  switch (source.origin) {
    case ItemSourceOrigin.Ground:
      return {

      };
    default:
      return source;
  }
}

export function isSameSourceOrigin<A extends ItemSource, B extends ItemSource>(a: A, b: B): boolean {
  return a.origin === b.origin && a.originId === b.originId;
}

export function isSameItemSource<A extends ItemSource, B extends ItemSource>(a?: A, b?: B): boolean;
export function isSameItemSource<A extends ItemSource, B extends Partial<ItemSource>>(a?: A, b?: B): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends PlayerInventoryItemSource>(a?: A, b?: B): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends PlayerEquipmentItemSource>(a?: A, b?: B): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends StorageItemSource>(a?: A, b?: B): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends GroundItemSource>(a?: A, b?: B): a is A & B;
export function isSameItemSource(
  a?: ItemSource,
  b?: ItemSource
): boolean {
  if (!a || !b) {
    return false;
  }

  return Object.entries(b).every(([key, value]) => a[key as keyof ItemSource] === value);
}

type ItemNode = { source: ItemSource; node: { value: HTMLElement | undefined } };

interface State {
  itemNodes: ItemNode[];
  currentInteraction: ItemInteraction;
  selectedItem?: SlottedItem;
  draggingItemThisFrame: boolean;
  previewingItem?: SlottedItem;
  ammunitionPanelRef?: Ref<HTMLElement>;
}

export const useInventory = defineStore("inventory", {
  state: (): State => ({
    itemNodes: [],
    currentInteraction: IDLE,
    draggingItemThisFrame: false,
    selectedItem: undefined,
    previewingItem: undefined,
    ammunitionPanelRef: undefined,
  }),
  getters: {
    character: () => {
      return useCharacter();
    },
    playerId(): string {
      return this.character.id;
    },
    storage: () => {
      return useGameState().openedStorage;
    },
    droppedItems: () => {
      /**
       * .filter(Boolean) doesn't really makes sense from the first glance,
       * but it's a workaround for a bug where the item after being picked up
       * would end up being undefined in the array for a brief moment. Idk don't ask.
       */
      return useClient().droppedItems.filter(Boolean);
    },
    size(): number {
      return this.character.inventory.size ?? 24;
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
      if (this.storage) {
        const storageItems = this.storage.inventory.items;

        for (const item of storageItems) {
          items.push({
            item: item.item,
            price: item.price,
            source: {
              ...this.storage.source,
              inventorySlot: item.slot,
            } satisfies StorageItemSource,
          });
        }
      }

      /**
       * Nearby items
       */
      for (const groundItem of this.droppedItems) {
        items.push({
          item: groundItem.item,
          source: {
            origin: ItemSourceOrigin.Ground,
            originId: groundItem.id,
          } satisfies GroundItemSource,
        });
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
    interactionItems(): SlottedItem<StorageItemSource>[] {
      return this.items.filter(
        (item): item is SlottedItem<StorageItemSource> =>
          item.source.origin === ItemSourceOrigin.Storage
      );
    },
    groundItems(): SlottedGroundItem[] {
      return this.items.filter(
        (item): item is SlottedGroundItem => item.source.origin === ItemSourceOrigin.Ground
      ).slice(0, 24);
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
    useItem(source: InventoryItemSource | GroundItemSource) {
      return rpc.callServer(ServerCall.FromWebview.USE_ITEM, source);
    },
    equipItem(source: InventoryItemSource | GroundItemSource) {
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
        if (from.source.origin === ItemSourceOrigin.Ground || to.source.origin === ItemSourceOrigin.Ground) {
          return;
        }
        [from.source, to.source] = [to.source, from.source];
      } else if (from) {
        if ("source" in to) {
          if (from.source.origin === ItemSourceOrigin.Ground || to.source.origin === ItemSourceOrigin.Ground) {
            return;
          }
          from.source = to.source;
        } else {
          if (from.source.origin === ItemSourceOrigin.Ground || to.origin === ItemSourceOrigin.Ground) {
            return;
          }
          from.source = to;
        }
      }
    },
    openAmmunitionPanel() {
      setTimeout(() => {
        this.currentInteraction = {
          type: InteractionType.AmmunitionPanel,
        };
      }, 0);
    },
    closeAmmunitionPanel() {
      this.currentInteraction = IDLE;
    },
    transferAmount(from: ItemSource, to: ItemSource | null, position: { x: number; y: number }) {
      return new Promise<number>((resolve, reject) => {
        if (to && isSameSourceOrigin(from, to)) {
          return reject("Cannot transfer to the same source origin");
        }

        const fromItem = this.getItemFromSource(from);

        if (!fromItem) {
          return reject("No item in source");
        }

        this.currentInteraction = { type: InteractionType.TransferingAmount, state: { item: fromItem, to, resolve, reject, position } };
        return true;
      });
    },
    confirmAmountTransfer(amount: number) {
      if (this.currentInteraction.type !== InteractionType.TransferingAmount) {
        return;
      }

      const slottedItem = this.currentInteraction.state.item;

      if (!slottedItem) {
        this.currentInteraction.state.reject();
        return;
      }

      if (amount <= 0) {
        return;
      }

      if (isStackable(slottedItem.item) && amount > slottedItem.item.amount) {
        amount = slottedItem.item.amount;
      }

      this.currentInteraction.state.resolve(amount);
    },
    cancelAmountTransfer() {
      if (this.currentInteraction.type === InteractionType.TransferingAmount) {
        this.currentInteraction.state.reject();
        this.currentInteraction = IDLE;
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

      if (this.ammunitionPanelRef?.value?.contains(e.target as HTMLElement)) {
        return;
      }

      const source = this.getItemSourceFromScreenPos(e.clientX, e.clientY);

      if (!source) {
        return;
      }

      const item = this.getItemFromSource(source);

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

          const itemInSlot = this.getItemFromSource(source);

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

        const slottedItem = this.currentInteraction.state.item;
        const from = slottedItem.source;
        const to = this.getItemSourceFromScreenPos(e.clientX, e.clientY);

        try {
          if (from.origin === ItemSourceOrigin.Ground && !to) {
            throw new Error("Cannot move item from ground to ground");
          }

          const isSameOrigin = to && isSameSourceOrigin(from, to);

          const amount = isSameOrigin
            // move full amount because we don't split items in the same origin
            ? (isStackable(slottedItem.item) ? slottedItem.item.amount : 1)
            // ask for amount to move
            : await this.transferAmount(from, to, { x: e.clientX, y: e.clientY });

          // if we're dropping the item
          if (!to || to.origin === ItemSourceOrigin.Ground) {
            // we can drop it only from either inventory or equipment
            if ([ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.PlayerEquipment].includes(from.origin)) {
              this.dropItem(from as PlayerItemSource, amount);
            } else {
              throw new Error("Cannot drop item from this source");
            }
          } else {
            // Move the item or swap with another item
            this.moveItem(from, to, { amount });
          }
        } catch (e) {
          console.error(e);
        }

        this.currentInteraction = IDLE;

        this.draggingItemThisFrame = true;
        requestAnimationFrame(() => {
          this.draggingItemThisFrame = false;
        });
      }
    },
    handleClick(e: MouseEvent) {
      if (this.currentInteraction.type === InteractionType.ContextMenu) {
        this.selectedItem = undefined;
        return;
      }

      if (this.currentInteraction.type === InteractionType.AmmunitionPanel) {
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
      if (this.currentInteraction.type !== InteractionType.TransferingAmount) {
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
        if (this.currentInteraction?.type === InteractionType.TransferingAmount) {
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
        type: InteractionType.TransferingAmount,
        state: {
          item,
          to: null,
          resolve: (amount) => {
            this.dropItem(source, amount);
            this.currentInteraction = IDLE;
          },
          reject: () => {
            this.currentInteraction = IDLE;
          },
          position: {
            x: position.x,
            y: position.y,
          },
        },
      };
    },
    cancelDropping() {
      if (this.currentInteraction.type === InteractionType.TransferingAmount) {
        this.currentInteraction = IDLE;
      }
    },
    openContextMenu(item: SlottedItem, event: PointerEvent | MouseEvent) {
      if ([InteractionType.TransferingAmount]?.includes(this.currentInteraction.type)) {
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
