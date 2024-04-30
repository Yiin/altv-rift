import { computed, markRaw, reactive, ref, watchEffect } from "vue";
import { ServerCall } from "@shared/calls/server";
import { ClientEvents } from "@shared/events/client";
import {
  CombineType,
  type Equipment,
  type Item,
  getCombineType,
  isStackable,
} from "@shared/modules/items";
import {
  EquipmentSlot,
  type GroundItemSource,
  type StorageItemSource,
  type InventoryItemSource,
  type ItemSource,
  ItemSourceOrigin,
  type PlayerEquipmentItemSource,
  type PlayerInventoryItemSource,
  type PlayerItemSource,
} from "@shared/interfaces";
import { rpc } from "@/rpc";
import { isCharacterStoreAvailable, useCharacter } from "./synced/character.store";
import { useGameState } from "./synced/game-state.store";
import { useClient } from "./synced/client.store";

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
      hidden?: boolean;
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
    }
  | {
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
      return {};
    default:
      return source;
  }
}

export function isSameSourceOrigin<A extends ItemSource, B extends ItemSource>(
  a: A,
  b: B,
): boolean {
  return a.origin === b.origin && a.originId === b.originId;
}

export function isSameItemSource<A extends ItemSource, B extends ItemSource>(a?: A, b?: B): boolean;
export function isSameItemSource<A extends ItemSource, B extends Partial<ItemSource>>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends PlayerInventoryItemSource>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends PlayerEquipmentItemSource>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends StorageItemSource>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends GroundItemSource>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource(a?: ItemSource, b?: ItemSource): boolean {
  if (!a || !b) {
    return false;
  }

  return Object.entries(b).every(([key, value]) => a[key as keyof ItemSource] === value);
}

type ItemNode = { source: ItemSource; node: { value: HTMLElement | undefined } };

const itemNodes = reactive<ItemNode[]>([]);
const currentInteraction = ref<ItemInteraction>(IDLE);
const draggingItemThisFrame = ref(false);
const selectedItem = ref<SlottedItem>();
const previewingItem = ref<SlottedItem>();
const ammunitionPanelRef = ref<HTMLElement>();

const character = computed(() => useCharacter());
const storage = computed(() => useGameState().openedStorage);
const droppedItems = computed(() => useClient().droppedItems);
const size = computed(() => character.value.inventory.size ?? 24);
const items = computed(() => {
  const items: SlottedItem[] = reactive([]);

  if (!("altMock" in globalThis) && !isCharacterStoreAvailable()) {
    return items;
  }

  /**
   * Player inventory
   */
  const inventoryItems = character.value.inventory.items;

  for (const inventoryItem of inventoryItems) {
    items.push({
      item: inventoryItem.item,
      price: inventoryItem.price,
      source: {
        origin: ItemSourceOrigin.PlayerInventory,
        originId: character.value.id,
        inventorySlot: inventoryItem.slot,
      } satisfies PlayerInventoryItemSource,
    });
  }

  /**
   * Player equipment
   */
  const equipmentItems = Object.entries(character.value.equipment ?? {}).filter(
    ([, item]) => !!item,
  ) as [EquipmentSlot, Item][];

  for (const [equipmentSlot, item] of equipmentItems) {
    items.push({
      item,
      source: {
        origin: ItemSourceOrigin.PlayerEquipment,
        originId: character.value.id,
        equipmentSlot,
      } satisfies PlayerEquipmentItemSource,
    });
  }

  /**
   * Opened storage inventory
   */
  if (storage.value) {
    const storageItems = storage.value.inventory.items;

    for (const item of storageItems) {
      items.push({
        item: item.item,
        price: item.price,
        source: {
          ...storage.value.source,
          inventorySlot: item.slot,
        } satisfies StorageItemSource,
      });
    }
  }

  /**
   * Nearby items
   */
  for (const groundItem of droppedItems.value) {
    items.push({
      item: groundItem.item,
      source: {
        origin: ItemSourceOrigin.Ground,
        originId: groundItem.id,
      } satisfies GroundItemSource,
    });
  }

  return items;
});

const inventoryItems = computed(() =>
  items.value.filter(
    (item): item is SlottedItem<PlayerInventoryItemSource> =>
      item.source.origin === ItemSourceOrigin.PlayerInventory,
  ),
);

const equipmentItems = computed(() =>
  items.value.filter(
    (item): item is SlottedItem<PlayerEquipmentItemSource> =>
      item.source.origin === ItemSourceOrigin.PlayerEquipment,
  ),
);

const interactionItems = computed(() =>
  items.value.filter(
    (item): item is SlottedItem<StorageItemSource> =>
      item.source.origin === ItemSourceOrigin.Storage,
  ),
);

const groundItems = computed(() =>
  items.value
    .filter((item): item is SlottedGroundItem => item.source.origin === ItemSourceOrigin.Ground)
    .slice(0, 24),
);

const equipment = computed(() => {
  const equipment: SlottedEquipment = {
    mask: null,
    glasses: null,
    headwear: null,
    earrings: null,
    top: null,
    armor: null,
    accessory: null,
    weapon:
      "altMock" in globalThis
        ? ({
            item: {
              key: "grenade",
              durability: 100,
              ammo: null,
              components: [],
              tint: 0,
            },
            source: {
              origin: ItemSourceOrigin.PlayerEquipment,
              originId: character.value.id,
              equipmentSlot: "weapon",
            },
          } as any)
        : null,
    gloves: null,
    lefthand: null,
    pants: null,
    righthand: null,
    backpack: null,
    shoes: null,
    phone: null,
  };

  for (const item of equipmentItems.value) {
    const equipmentSlot = item.source.equipmentSlot;
    // @ts-expect-error item is guaranteed to be of correct type,
    // but TS is complaining that e.g. ClothingItem might be on weapon slot
    equipment[equipmentSlot] = item;
  }
  return equipment;
});

function updateInteraction(interaction: ItemInteraction) {
  currentInteraction.value = interaction;
}
function registerItemSlot(slot: ItemNode) {
  itemNodes.push(markRaw(slot));
}
function useItem(source: InventoryItemSource | GroundItemSource) {
  return rpc.callServer(ServerCall.FromWebview.USE_ITEM, source);
}
function equipItem(source: InventoryItemSource | GroundItemSource) {
  return rpc.callServer(ServerCall.FromWebview.EQUIP_ITEM, source);
}
function unequipItem(equipmentSlot: EquipmentSlot) {
  return rpc.callServer(ServerCall.FromWebview.UNEQUIP_ITEM, equipmentSlot);
}
function dropItem(source: PlayerItemSource, amount: number) {
  if (window.altMock) {
    return Promise.resolve(true);
  }

  return rpc.callServer(ServerCall.FromWebview.DROP_ITEM, source, amount);
}
function combineItems(weaponSource: ItemSource, ammoSource: ItemSource) {
  return rpc.callServer(ServerCall.FromWebview.COMBINE_ITEMS, weaponSource, ammoSource);
}
function unloadAmmo(source: ItemSource) {
  return rpc.callServer(ServerCall.FromWebview.UNLOAD_AMMO, source);
}
function removeBait(source: ItemSource) {
  return rpc.callServer(ServerCall.FromWebview.REMOVE_BAIT, source);
}
function swapLocally(from: SlottedItem | undefined, to: SlottedItem | ItemSource) {
  const toSource = "source" in to ? to.source : to;

  if (
    from?.source.origin === ItemSourceOrigin.Ground ||
    toSource.origin === ItemSourceOrigin.Ground ||
    from?.source.origin === ItemSourceOrigin.Storage ||
    toSource.origin === ItemSourceOrigin.Storage
  ) {
    return;
  }
  if (from) {
    if ("source" in to) {
      to.source = from.source;
    }
    from.source = toSource;
  }
}
function openAmmunitionPanel() {
  setTimeout(() => {
    updateInteraction({
      type: InteractionType.AmmunitionPanel,
    });
  }, 0);
}
function closeAmmunitionPanel() {
  if (currentInteraction.value.type === InteractionType.AmmunitionPanel) {
    updateInteraction(IDLE);
  }
}
function transferAmount(
  from: ItemSource,
  to: ItemSource | null,
  position: { x: number; y: number },
) {
  return new Promise<number>((resolve, reject) => {
    if (to && isSameSourceOrigin(from, to)) {
      return reject("Cannot transfer to the same source origin");
    }

    const fromItem = getItemFromSource(from);

    if (!fromItem) {
      return reject("No item in source");
    }

    updateInteraction({
      type: InteractionType.TransferingAmount,
      state: { item: fromItem, to, resolve, reject, position },
    });

    return true;
  });
}
function confirmAmountTransfer(amount: number) {
  if (currentInteraction.value.type !== InteractionType.TransferingAmount) {
    return;
  }

  const slottedItem = currentInteraction.value.state.item;

  if (!slottedItem) {
    currentInteraction.value.state.reject();
    return;
  }

  if (amount <= 0) {
    return;
  }

  if (isStackable(slottedItem.item) && amount > slottedItem.item.amount) {
    amount = slottedItem.item.amount;
  }

  currentInteraction.value.state.resolve(amount);
}
function cancelAmountTransfer() {
  if (currentInteraction.value.type === InteractionType.TransferingAmount) {
    currentInteraction.value.state.reject();
  }
}
async function moveItem(
  from: ItemSource,
  to: ItemSource,
  options: { localOnly?: boolean; amount?: number } = {},
) {
  const itemInSlotFrom = getItemFromSource(from);
  const itemInSlotTo = getItemFromSource(to);

  if (options.localOnly) {
    swapLocally(itemInSlotFrom, itemInSlotTo || to);
    return true;
  }

  swapLocally(itemInSlotFrom, itemInSlotTo || to);

  const ok = await rpc.callServer(ServerCall.FromWebview.MOVE_ITEM, from, to, options.amount);

  if (!ok) {
    moveItem(to, from, { localOnly: true, amount: options.amount });
  }
  return ok;
}
function handleMouseDown(e: MouseEvent) {
  if (e.button !== 0) {
    return;
  }

  if (ammunitionPanelRef.value?.contains(e.target as HTMLElement)) {
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

  updateInteraction({
    type: InteractionType.Dragging,
    maybe: true,
    state: {
      item,
      startPosition: { x: e.clientX, y: e.clientY },
      currentPosition: { x: e.clientX, y: e.clientY },
    },
  });
}
function handleMouseMove(e: MouseEvent) {
  if (
    currentInteraction.value.type === InteractionType.Dragging &&
    currentInteraction.value.maybe
  ) {
    if (
      currentInteraction.value.state.startPosition.x !== e.clientX ||
      currentInteraction.value.state.startPosition.y !== e.clientY
    ) {
      alt.emit(ClientEvents.FromWebview.PLAY_SOUND, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET");

      currentInteraction.value.maybe = false;
      selectedItem.value = undefined;
    }
  }
  switch (currentInteraction.value.type) {
    case InteractionType.Dragging:
      currentInteraction.value.state.currentPosition.x = e.clientX;
      currentInteraction.value.state.currentPosition.y = e.clientY;
      return;
    case InteractionType.Hovering:
    case InteractionType.None:
      const source = getItemSourceFromScreenPos(e.clientX, e.clientY);

      if (!source) {
        updateInteraction(IDLE);
        return;
      }

      if (currentInteraction.value.type === InteractionType.Hovering) {
        if (isSameItemSource(currentInteraction.value.state.item.source, source)) {
          currentInteraction.value.state.position.x = e.clientX;
          currentInteraction.value.state.position.y = e.clientY;
          return;
        }
      }

      const itemInSlot = getItemFromSource(source);

      if (!itemInSlot) {
        updateInteraction(IDLE);
        return;
      }

      updateInteraction({
        type: InteractionType.Hovering,
        state: {
          item: itemInSlot,
          position: { x: e.clientX, y: e.clientY },
        },
      });
  }
}
async function handleMouseUp(e: MouseEvent) {
  if (currentInteraction.value.type === InteractionType.Dragging) {
    if (currentInteraction.value.maybe) {
      updateInteraction(IDLE);
      return;
    }

    const slottedItem = currentInteraction.value.state.item;
    const from = slottedItem.source;
    const to = getItemSourceFromScreenPos(e.clientX, e.clientY);

    const isFromGroundToGround =
      from.origin === ItemSourceOrigin.Ground && (!to || to.origin === ItemSourceOrigin.Ground);
    const canMoveItem = !isFromGroundToGround;
    const fullAmount = isStackable(slottedItem.item) ? slottedItem.item.amount : 1;

    let promise;

    if (canMoveItem) {
      try {
        const isSameOrigin =
          to &&
          (isSameSourceOrigin(from, to) ||
            [from, to].every((s) =>
              [ItemSourceOrigin.PlayerEquipment, ItemSourceOrigin.PlayerInventory].includes(
                s.origin,
              ),
            ));
        const isFromGround = from.origin === ItemSourceOrigin.Ground;
        const isSingleItem = !isStackable(slottedItem.item) || slottedItem.item.amount === 1;

        const amount =
          isSameOrigin || (isFromGround && isSingleItem)
            ? // move full amount because we don't split items in the same origin
              fullAmount
            : // ask for amount to move
              await transferAmount(from, to, { x: e.clientX, y: e.clientY });

        // if we're dropping the item
        if (!to || to.origin === ItemSourceOrigin.Ground) {
          // we can drop it only from either inventory or equipment
          if (
            [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.PlayerEquipment].includes(
              from.origin,
            )
          ) {
            await dropItem(from as PlayerItemSource, amount);
          }
        } else {
          // Move the item or swap with another item
          promise = moveItem(from, to, { amount });
        }
      } catch {
        // couldn't move the item, oh well ¯\_(ツ)_/¯
      }
    }

    if (from.origin === ItemSourceOrigin.Ground && !isFromGroundToGround) {
      // fixes item icon appearing back on the ground for a brief moment
      // after picking it up
      const stopWatching = watchEffect(() => {
        const item = getItemFromSource(from);
        if (!item || ("amount" in item.item && item.item.amount < fullAmount)) {
          if (currentInteraction.value.type === InteractionType.Dragging) {
            updateInteraction(IDLE);
          }
          stopWatching();
          return;
        }
      });

      // fallback if the item wasn't picked up
      promise?.then((result) => {
        if (!result) {
          if (currentInteraction.value.type === InteractionType.Dragging) {
            updateInteraction(IDLE);
          }
          stopWatching();
        }
      });
    } else {
      updateInteraction(IDLE);
    }

    draggingItemThisFrame.value = true;
    requestAnimationFrame(() => {
      draggingItemThisFrame.value = false;
    });
  }
}
function handleClick(e: MouseEvent) {
  if (currentInteraction.value.type === InteractionType.ContextMenu) {
    selectedItem.value = undefined;
    return;
  }

  if (currentInteraction.value.type === InteractionType.AmmunitionPanel) {
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
    if (selectedItem.value) {
      selectedItem.value = undefined;
    }
    return;
  }

  if (selectedItem.value && isSameItemSource(itemInSlot.source, selectedItem.value.source)) {
    selectedItem.value = undefined;
    return;
  }

  if (selectedItem.value) {
    const target = itemInSlot;
    const source = selectedItem.value;

    const [combineType] = getCombineType(target.item.key, source.item.key);

    if (combineType !== CombineType.None) {
      selectedItem.value = undefined;

      combineItems(source.source, target.source);
    }
  }

  if (currentInteraction.value.type === InteractionType.Dragging || draggingItemThisFrame.value) {
    return;
  }

  if (
    currentInteraction.value.type !== InteractionType.None &&
    currentInteraction.value.type !== InteractionType.Hovering
  ) {
    updateInteraction(IDLE);
  }

  selectedItem.value = itemInSlot;
}
async function completeDropping(amount: number) {
  if (currentInteraction.value.type !== InteractionType.TransferingAmount) {
    return;
  }

  const source = currentInteraction.value.state.item.source;

  if (
    source.origin !== ItemSourceOrigin.PlayerEquipment &&
    source.origin !== ItemSourceOrigin.PlayerInventory
  ) {
    updateInteraction(IDLE);
    return;
  }

  const shouldDrop = await dropItem(source, amount);

  if (!shouldDrop) {
    updateInteraction(IDLE);
    return;
  }
}
function dropFromMenu(source: PlayerItemSource) {
  const position = getItemSourceScreenPosition(source);
  const item = getItemFromSource(source);

  if (!item) {
    return;
  }

  updateInteraction({
    type: InteractionType.TransferingAmount,
    state: {
      item,
      to: null,
      resolve: (amount) => {
        dropItem(source, amount);
        updateInteraction(IDLE);
      },
      reject: () => {
        updateInteraction(IDLE);
      },
      position: {
        x: position.x,
        y: position.y,
      },
    },
  });
}
function cancelDropping() {
  if (currentInteraction.value.type === InteractionType.TransferingAmount) {
    updateInteraction(IDLE);
  }
}
function openContextMenu(item: SlottedItem, event: PointerEvent | MouseEvent) {
  if ([InteractionType.TransferingAmount]?.includes(currentInteraction.value.type)) {
    return;
  }

  updateInteraction({
    type: InteractionType.ContextMenu,
    state: { item, x: event.clientX, y: event.clientY, ts: Date.now() },
  });
}
function closeActionMenu() {
  if (currentInteraction.value.type === InteractionType.ContextMenu) {
    updateInteraction(IDLE);
    selectedItem.value = undefined;
  }
}
function getItemFromSource<T extends ItemSource>(source: T) {
  return items.value.find((item): item is SlottedItem<T> => isSameItemSource(item.source, source));
}
function getNodeRect(node?: HTMLElement) {
  if (!node) {
    return null;
  }

  const cache = node.cache;

  if (cache && cache.freshUntil > Date.now()) {
    return cache.rect;
  }

  const rect = node.parentElement?.classList.contains("node-anchor")
    ? node.parentElement.getBoundingClientRect()
    : node.getBoundingClientRect();

  node.cache = {
    rect,
    freshUntil: Date.now() + 1000,
  };

  return rect;
}
function getItemSourceFromScreenPos(x: number, y: number) {
  const MAX_DISTANCE = 8;

  const distanceToRect = (rect: DOMRect, x: number, y: number): number => {
    const dx = x - Math.max(rect.left, Math.min(x, rect.right));
    const dy = y - Math.max(rect.top, Math.min(y, rect.bottom));
    return Math.sqrt(dx * dx + dy * dy);
  };

  const closest = itemNodes
    .map((slot) => {
      const rect = getNodeRect(slot.node.value);

      if (!rect) {
        return null;
      }

      return [slot.source, rect, distanceToRect(rect, x, y)] as const;
    })
    .filter(
      (entry): entry is NonNullable<typeof entry> => entry !== null && entry[2] <= MAX_DISTANCE,
    )
    .sort((a, b) => a[2] - b[2])[0];

  return closest ? closest[0] : null;
}
function getItemNodeFromSource(source: ItemSource) {
  const slot = itemNodes.find((slot) => isSameItemSource(slot.source, source));
  return slot?.node.value;
}
function getItemSourceScreenPosition(source: ItemSource) {
  const itemNode = itemNodes.find((slot) => isSameItemSource(slot.source, source));

  if (!itemNode) {
    return { x: 0, y: 0 };
  }

  const rect = getNodeRect(itemNode.node.value);

  if (!rect) {
    return { x: 0, y: 0 };
  }

  return { x: rect.x, y: rect.y };
}
function getItemRelativeScreenPositionFromSource(source: ItemSource) {
  const node = getItemNodeFromSource(source);

  if (!node) {
    return { x: 0, y: 0 };
  }
  return { x: node.offsetLeft, y: node.offsetTop };
}

export function useInventory() {
  return {
    size,
    items,
    inventoryItems,
    equipmentItems,
    interactionItems,
    groundItems,
    equipment,
    itemNodes,
    currentInteraction,
    selectedItem,
    previewingItem,
    ammunitionPanelRef,
    updateInteraction,
    registerItemSlot,
    useItem,
    equipItem,
    unequipItem,
    dropItem,
    combineItems,
    unloadAmmo,
    removeBait,
    swapLocally,
    openAmmunitionPanel,
    closeAmmunitionPanel,
    transferAmount,
    confirmAmountTransfer,
    cancelAmountTransfer,
    moveItem,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick,
    completeDropping,
    dropFromMenu,
    cancelDropping,
    openContextMenu,
    closeActionMenu,
    getItemFromSource,
    getNodeRect,
    getItemSourceFromScreenPos,
    getItemNodeFromSource,
    getItemSourceScreenPosition,
    getItemRelativeScreenPositionFromSource,

    $reset() {
      itemNodes.length = 0;
      currentInteraction.value = IDLE;
      selectedItem.value = undefined;
      previewingItem.value = undefined;
      draggingItemThisFrame.value = false;
    },
  };
}
