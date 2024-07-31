import alt from "@altv/client";
import { VirtualEntityType } from "@shared/interfaces";

export function getNearbyTrees({ distance }: { distance?: number } = {}) {
  return alt.VirtualEntity.streamedIn.filter(
    (entity) =>
      entity.streamSyncedMeta.entityType === VirtualEntityType.Tree &&
      (!distance || entity.pos.distanceTo(alt.Player.local.pos) <= distance),
  );
}
