import { ServerCall } from "@shared/calls/server";
import { isStackable } from "@shared/modules/items";
import {
  EquipmentSlot,
  type GroundItemSource,
  type InventoryItemSource,
  type ItemSource,
  ItemSourceOrigin,
  type PlayerItemSource,
} from "@shared/interfaces";
import { rpc } from "@/rpc";
import { InventoryInteractionType, type SlottedItem } from "./inventory.types";
import {
  getItemFromSource,
  getItemSourceScreenPosition,
  isSameSourceOrigin,
} from "./inventory.utils";
import {
  clearCurrentInventoryInteraction,
  clearSelectedItem,
  getCurrentInventoryInteraction,
  setCurrentInventoryInteraction,
} from "./inventory.state";

export function useItem(source: InventoryItemSource | GroundItemSource) {
  return rpc.callServer(ServerCall.FromWebview.USE_ITEM, source);
}

export function equipItem(source: InventoryItemSource | GroundItemSource) {
  return rpc.callServer(ServerCall.FromWebview.EQUIP_ITEM, source);
}

export function unequipItem(equipmentSlot: EquipmentSlot) {
  return rpc.callServer(ServerCall.FromWebview.UNEQUIP_ITEM, equipmentSlot);
}

export function dropItem(source: PlayerItemSource, amount: number) {
  if (window.altMock) {
    return Promise.resolve(true);
  }

  return rpc.callServer(ServerCall.FromWebview.DROP_ITEM, source, amount);
}

export function combineItems(weaponSource: ItemSource, ammoSource: ItemSource) {
  return rpc.callServer(ServerCall.FromWebview.COMBINE_ITEMS, weaponSource, ammoSource);
}

export function unloadAmmo(source: ItemSource) {
  return rpc.callServer(ServerCall.FromWebview.UNLOAD_AMMO, source);
}

export function removeBait(source: ItemSource) {
  return rpc.callServer(ServerCall.FromWebview.REMOVE_BAIT, source);
}

export function swapLocally(from: SlottedItem | undefined, to: SlottedItem | ItemSource) {
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

export function openAmmunitionPanel() {
  setTimeout(() => {
    setCurrentInventoryInteraction({
      type: InventoryInteractionType.AmmunitionPanel,
    });
  }, 0);
}

export function closeAmmunitionPanel() {
  if (getCurrentInventoryInteraction().type === InventoryInteractionType.AmmunitionPanel) {
    clearCurrentInventoryInteraction();
  }
}

export function transferAmount(
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

    setCurrentInventoryInteraction({
      type: InventoryInteractionType.TransferingAmount,
      state: { item: fromItem, to, resolve, reject, position },
    });

    return true;
  });
}

export function confirmAmountTransfer(amount: number) {
  const currentInteraction = getCurrentInventoryInteraction();

  if (currentInteraction.type !== InventoryInteractionType.TransferingAmount) {
    return;
  }

  const slottedItem = currentInteraction.state.item;

  if (!slottedItem) {
    currentInteraction.state.reject();
    return;
  }

  if (amount <= 0) {
    return;
  }

  if (isStackable(slottedItem.item) && amount > slottedItem.item.amount) {
    amount = slottedItem.item.amount;
  }

  currentInteraction.state.resolve(amount);
}

export function cancelAmountTransfer() {
  const currentInteraction = getCurrentInventoryInteraction();

  if (currentInteraction.type === InventoryInteractionType.TransferingAmount) {
    currentInteraction.state.reject();
  }
}

export async function moveItem(
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

export async function completeDropping(amount: number) {
  const currentInteraction = getCurrentInventoryInteraction();

  if (currentInteraction.type !== InventoryInteractionType.TransferingAmount) {
    return;
  }

  const source = currentInteraction.state.item.source;

  if (
    source.origin !== ItemSourceOrigin.PlayerEquipment &&
    source.origin !== ItemSourceOrigin.PlayerInventory
  ) {
    clearCurrentInventoryInteraction();
    return;
  }

  const shouldDrop = await dropItem(source, amount);

  if (!shouldDrop) {
    clearCurrentInventoryInteraction();
    return;
  }
}

export function dropFromMenu(source: PlayerItemSource) {
  const position = getItemSourceScreenPosition(source);
  const item = getItemFromSource(source);

  if (!item) {
    return;
  }

  setCurrentInventoryInteraction({
    type: InventoryInteractionType.TransferingAmount,
    state: {
      item,
      to: null,
      resolve: (amount) => {
        dropItem(source, amount);
        clearCurrentInventoryInteraction();
      },
      reject: () => {
        clearCurrentInventoryInteraction();
      },
      position: {
        x: position.x,
        y: position.y,
      },
    },
  });
}

export function cancelDropping() {
  if (getCurrentInventoryInteraction().type === InventoryInteractionType.TransferingAmount) {
    clearCurrentInventoryInteraction();
  }
}

export function openContextMenu(item: SlottedItem, event: PointerEvent | MouseEvent) {
  if (
    [InventoryInteractionType.TransferingAmount]?.includes(getCurrentInventoryInteraction().type)
  ) {
    return;
  }

  setCurrentInventoryInteraction({
    type: InventoryInteractionType.ContextMenu,
    state: { item, x: event.clientX, y: event.clientY, ts: Date.now() },
  });
}

export function closeActionMenu() {
  if (getCurrentInventoryInteraction().type === InventoryInteractionType.ContextMenu) {
    clearCurrentInventoryInteraction();
    clearSelectedItem();
  }
}
