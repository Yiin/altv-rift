import alt from "@altv/client";
import { VirtualEntityType } from "@shared/interfaces";

declare module "@altv/client" {
  interface VirtualEntity {
    marker?: alt.Marker;
  }

  interface MarkerMeta {
    virtualEntity?: alt.VirtualEntity;
  }
}

alt.Events.onWorldObjectStreamIn(({ object }) => {
  if (object instanceof alt.VirtualEntity === false) {
    return;
  }

  if (object.streamSyncedMeta.entityType !== VirtualEntityType.Marker) {
    return;
  }

  alt.log(`[Markers] Creating marker ${object.id} at ${JSON.stringify(object.pos)}`);

  const { type, color, scale } = object.streamSyncedMeta;

  object.marker = alt.Marker.create({
    pos: object.pos,
    type: type!,
    color: color!,
    streamingDistance: 50,
    useStreaming: true,
  });

  if (scale) {
    object.marker.scale = scale;
  }

  object.marker.meta.virtualEntity = object;
});

alt.Events.onWorldObjectStreamOut(({ object }) => {
  if (object instanceof alt.VirtualEntity === false) {
    return;
  }

  object.marker?.destroy();
});
