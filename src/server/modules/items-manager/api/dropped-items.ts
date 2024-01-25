import * as alt from '@altv/server';
import { toRaw } from 'vue';
import { Item } from '@shared/modules/items';
import { ItemSourceOrigin } from '@shared/interfaces';
import { findItem } from './hooks';

export const droppedItemsGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });
export const droppedItems: Map<number, alt.VirtualEntity> = new Map();


findItem.hook((itemSource, player) => {
  if (itemSource.origin !== ItemSourceOrigin.Global) {
    return;
  }

  const droppedItemVE = droppedItems.get(itemSource.originId);

  if (!droppedItemVE) {
    return null;
  }

  if (player && droppedItemVE.pos.distanceTo(player.pos) > 5) {
    return null;
  }

  const item = droppedItemVE.streamSyncedMeta.item;

  if (!item) {
    return null;
  }

  return item;
});

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
