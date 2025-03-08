import alt from "@altv/client";
import { VirtualEntityType } from "@shared/interfaces";

declare module "@altv/client" {
  interface VirtualEntity {
    marker?: alt.Marker;
  }
}

alt.Events.onBaseObjectCreate(({ object }) => {
  if (object instanceof alt.VirtualEntity === false) {
    return;
  }

  if (object.streamSyncedMeta.entityType !== VirtualEntityType.Marker) {
    return;
  }

  object.marker = alt.Marker.create({
    pos: object.pos,
    type: object.streamSyncedMeta.type!,
    color: object.streamSyncedMeta.color!,
    initialMeta: object.streamSyncedMeta.initialMeta,
  });
});

alt.Events.onBaseObjectRemove(({ object }) => {
  if (object instanceof alt.VirtualEntity === false) {
    return;
  }

  object.marker?.destroy();
});
