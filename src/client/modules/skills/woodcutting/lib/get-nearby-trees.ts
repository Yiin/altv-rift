import alt from "alt-client";

export function getNearbyTrees({ distance }: { distance?: number } = {}) {
  return alt.VirtualEntity.streamedIn.filter(
    (entity) =>
      entity.getStreamSyncedMeta("entityType") === "tree" &&
      (!distance || entity.pos.distanceTo(alt.Player.local.pos) <= distance)
  );
}
