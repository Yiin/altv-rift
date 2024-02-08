import * as alt from '@altv/server';
import { toRaw } from 'vue';
import { hoursToMilliseconds } from 'date-fns';
import { Item } from '@shared/modules/items';

export const droppedItemsGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });
export const droppedItems: Map<number, alt.VirtualEntity> = new Map();

export function dropItemOnTheGround(item: Item, position: alt.IVector3) {
  const ve = alt.VirtualEntity.create({
    group: droppedItemsGroup,
    pos: position,
    streamingDistance: 50,
    data: {
      entityType: 'item',
      item: toRaw(item)
    } satisfies alt.VirtualEntityStreamSyncedMeta
  });

  droppedItems.set(ve.id, ve);

  setTimeout(() => {
    cleanupDroppedItem(ve.id);
  }, hoursToMilliseconds(1));

  return ve;
}

export function cleanupDroppedItem(id: alt.VirtualEntity['id']) {
  const ve = droppedItems.get(id);

  if (!ve) {
    return;
  }

  ve.destroy();
  droppedItems.delete(id);
}
