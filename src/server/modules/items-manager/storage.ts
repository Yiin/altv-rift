import alt from '@altv/server';
import { reactive, UnwrapNestedRefs } from 'vue';
import { addMinutes } from 'date-fns';
import { Inventory, ItemSourceOrigin } from '@shared/interfaces';
import { StorageType } from '@shared/store/game-state.store';
import { Ammo, createItem } from '@shared/modules/items';
import { ServerEvents } from '@shared/events/server';
import { InGamePlayer } from '@/core/utility/assertions';
import { addItemToInventory, removeItemFromInventorySlot } from './api';

export const storageGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });
export const storageItems: Record<alt.VirtualEntity['id'], {
  label: string;
  inventory: UnwrapNestedRefs<Inventory>;
  meta?: Record<string, any>;
}> = {};

export function createStorage(options: {
  type?: StorageType;
  pos: alt.IVector3;
  inventory: Inventory;
  label: string,
  interpolate?: {
    ts: number;
    from: alt.IVector3;
    speed: number;
  };
  meta?: Record<string, any>
}): alt.VirtualEntity {
  const storage = alt.VirtualEntity.create({
    group: storageGroup,
    pos: options.pos,
    streamingDistance: 100,
    data: {
      entityType: 'storage',
      storageType: options.type ?? StorageType.Storage,
      interpolate: options.interpolate,
    }
  });

  storageItems[storage.id] = {
    label: options.label,
    inventory: reactive(options.inventory),
    meta: options.meta,
  };

  alt.Timers.nextTick(async () => {
    removeItemFromInventorySlot(storageItems[storage.id].inventory, 0);

    await alt.Utils.waitForNextTick();

    addItemToInventory(storageItems[storage.id].inventory, createItem(Ammo.ASSAULT_RIFLE_AMMO, { amount: 100 }));
  });

  return storage;
}

export function getStorageEntity(id: alt.VirtualEntity['id']): alt.VirtualEntity | null {
  return alt.VirtualEntity.getByID(id);
}

export function getStorage(id: alt.VirtualEntity['id']) {
  return storageItems[id];
}

export function getStorageInventory(id: alt.VirtualEntity['id']): Inventory {
  return storageItems[id]?.inventory;
}

export function openStorage(player: InGamePlayer, storageId: alt.VirtualEntity['id']) {
  const ve = alt.VirtualEntity.getByID(storageId);

  if (!ve) {
    return false;
  }

  if (!ve.streamSyncedMeta.storageType) {
    return false;
  }

  const storage = getStorage(storageId);

  if (!storage) {
    return false;
  }

  const { label, inventory } = storage;

  player.gameState.openedStorage = {
    type: ve.streamSyncedMeta.storageType,
    label,
    source: {
      origin: ItemSourceOrigin.Storage,
      originId: storageId,
    },
    validUntil: storage.meta?.validUntil ?? addMinutes(Date.now(), 5).getTime(),
    inventory,
  };

  return true;
}

export function closeStorage(player: InGamePlayer): void {
  player.gameState.openedStorage = null;
}

alt.Events.onPlayer(ServerEvents.FromClient.CLOSE_WINDOW, closeStorage);
