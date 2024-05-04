import alt from "@altv/server";
import { VirtualEntityStreamSyncedMeta } from "@altv/server";
import { VirtualEntityType } from "@shared/interfaces";

const areasOfInterest = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 20 });

export function createAreaOfInterest(
  pos: alt.IVector3,
  radius: number,
  data: Omit<VirtualEntityStreamSyncedMeta, "entityType"> = {},
) {
  const area = alt.VirtualEntity.create({
    group: areasOfInterest,
    pos,
    streamingDistance: radius,
    data: {
      ...data,
      entityType: VirtualEntityType.AreaOfInterest,
    },
  });

  return area;
}
