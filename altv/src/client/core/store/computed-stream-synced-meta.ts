import alt from "@altv/client";
import { reactive } from "@yiin/reactive-proxy-state";

alt.Events.onGameEntityCreate(({ entity }) => {
  entity.reactiveStreamSyncedMeta = reactive(JSON.parse(JSON.stringify(entity.streamSyncedMeta)));
});

alt.Events.onWorldObjectStreamIn(({ object }) => {
  if (object.type !== alt.Enums.BaseObjectType.VIRTUAL_ENTITY) {
    return;
  }
  (object as alt.VirtualEntity).reactiveStreamSyncedMeta = reactive(
    JSON.parse(JSON.stringify((object as alt.VirtualEntity).streamSyncedMeta)),
  );
});

alt.Events.onStreamSyncedMetaChange(({ entity, key, newValue }) => {
  if (!entity.reactiveStreamSyncedMeta) {
    return;
  }

  entity.reactiveStreamSyncedMeta[key] = newValue;
});
