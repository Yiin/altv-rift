import alt from "@altv/client";
import { VirtualEntityType } from "@shared/interfaces";

export function getNearbyOres({ distance }: { distance?: number } = {}) {
  return alt.VirtualEntity.streamedIn.filter(
    (entity) =>
      entity.streamSyncedMeta.entityType === VirtualEntityType.Ore &&
      (!distance || entity.pos.distanceTo(alt.Player.local.pos) <= distance),
  );
}
