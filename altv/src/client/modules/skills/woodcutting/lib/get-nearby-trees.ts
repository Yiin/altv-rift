import alt from "@altv/client";

export function getNearbyTrees({ distance }: { distance?: number } = {}) {
  return alt.VirtualEntity.streamedIn.filter(
    (entity) =>
      entity.streamSyncedMeta.entityType === "tree" &&
      (!distance || entity.pos.distanceTo(alt.Player.local.pos) <= distance),
  );
}
