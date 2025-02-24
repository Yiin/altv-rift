import alt from "@altv/server";
import { isReactive, reactive, UnwrapNestedRefs, watch } from "vue";
import { addMinutes } from "date-fns";
import { Inventory, ItemSourceOrigin, VirtualEntityType } from "@shared/interfaces";
import { StorageType } from "@shared/store/game-state.store";
import { ServerEvents } from "@shared/events/server";
import { AirDropType } from "@shared/modules/air-drops";
import { InGamePlayer, isInGame } from "@/core/utility/assertions";
import { WindowType } from "@shared/store/client.store";

interface StorageData {
  label: string;
  inventory: UnwrapNestedRefs<Inventory>;
  meta?: Record<string, any>;
  onOpen?(this: alt.VirtualEntity, player: InGamePlayer): void;
}

export const storageGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });
export const storageItems: Record<alt.VirtualEntity["id"], StorageData> = {};

export function createStorage(options: {
  type?: StorageType;
  pos: alt.IVector3;
  inventory: Inventory;
  label: string;
  interpolate?: {
    ts: number;
    from: alt.IVector3;
    speed: number;
  };
  airDropType?: AirDropType;
  meta?: Record<string, any>;
  windowType?: WindowType;

  onOpen?(this: alt.VirtualEntity, player: InGamePlayer): void;
}): alt.VirtualEntity {
  const storage = alt.VirtualEntity.create({
    group: storageGroup,
    pos: options.pos,
    streamingDistance: 100,
    data: {
      entityType: VirtualEntityType.Storage,
      storageType: options.type ?? StorageType.Storage,
      storageLabel: options.label,
      interpolate: options.interpolate,
      airDropType: options.airDropType,
      windowType: options.windowType,
    },
  });

  storageItems[storage.id] = {
    label: options.label,
    inventory: isReactive(options.inventory) ? options.inventory : reactive(options.inventory),
    meta: options.meta,
    onOpen: options.onOpen,
  };

  return storage;
}

export function getStorageEntity(id: alt.VirtualEntity["id"]): alt.VirtualEntity | null {
  return alt.VirtualEntity.getByID(id);
}

export function getStorage(id: alt.VirtualEntity["id"]): StorageData | undefined {
  return storageItems[id];
}

export function getStorageInventory(id: alt.VirtualEntity["id"]): Inventory {
  return storageItems[id]?.inventory;
}

export function openStorage(player: InGamePlayer, storageId: alt.VirtualEntity["id"]): boolean {
  const ve = alt.VirtualEntity.getByID(storageId);

  if (!ve) {
    alt.log("storage ve not found");
    return false;
  }

  if (!ve.streamSyncedMeta.storageType) {
    alt.log("storage type not found");
    return false;
  }

  const storage = getStorage(storageId);

  if (!storage) {
    alt.log("storage not found");
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
    validUntil: storage.meta?.validUntil,
    inventory,
  };

  alt.log("open storage", {
    type: ve.streamSyncedMeta.storageType,
    label,
    origin: ItemSourceOrigin.Storage,
    originId: storageId,
    validUntil: storage.meta?.validUntil,
  });

  if (storage.onOpen) {
    storage.onOpen.call(ve, player);
  }

  return true;
}

export function closeStorage(player: InGamePlayer): void {
  player.gameState.openedStorage = null;
}

alt.Events.onPlayer(ServerEvents.FromClient.CLOSE_WINDOW, closeStorage);

alt.Events.onBaseObjectRemove(({ object }) => {
  if (object instanceof alt.VirtualEntity) {
    for (const player of alt.Player.all) {
      if (!isInGame(player)) {
        continue;
      }

      if (player.gameState.openedStorage?.source.originId === object.id) {
        closeStorage(player);
      }
    }

    delete storageItems[object.id];
  }
});
