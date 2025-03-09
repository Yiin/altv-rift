import alt from "@altv/client";
import { VirtualEntityType } from "@shared/interfaces";

declare module "@altv/client" {
  interface VirtualEntity {
    marker?: alt.Marker;
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

  object.marker = alt.Marker.create({
    pos: object.pos,
    type: object.streamSyncedMeta.type!,
    color: object.streamSyncedMeta.color!,
    initialMeta: object.streamSyncedMeta.initialMeta,
    streamingDistance: 50,
    useStreaming: true,
  });

  if (object.streamSyncedMeta.scale) {
    object.marker.scale = object.streamSyncedMeta.scale;
  }
});

alt.Events.onWorldObjectStreamOut(({ object }) => {
  if (object instanceof alt.VirtualEntity === false) {
    return;
  }

  object.marker?.destroy();
});
