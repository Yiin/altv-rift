import alt from "@altv/server";
import { toRaw } from "vue";
import { hoursToMilliseconds } from "date-fns";
import { Item } from "@shared/modules/items";
import { VirtualEntityType } from "@shared/interfaces";

export const droppedItemsGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });

export function dropItemOnTheGround(item: Item, position: alt.IVector3): alt.VirtualEntity {
  const ve = alt.VirtualEntity.create({
    group: droppedItemsGroup,
    pos: position,
    streamingDistance: 50,
    data: {
      entityType: VirtualEntityType.Item,
      item: toRaw(item),
    } satisfies alt.VirtualEntityStreamSyncedMeta,
  });

  setTimeout(() => {
    cleanupDroppedItem(ve.id);
  }, hoursToMilliseconds(1));

  return ve;
}

export function cleanupDroppedItem(id: alt.VirtualEntity["id"]): void {
  const ve = alt.VirtualEntity.getByID(id);

  if (!ve) {
    return;
  }

  ve.destroy();
}
