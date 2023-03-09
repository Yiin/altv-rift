import { watch } from "vue";
import { npcSyncStore } from "@/store/npc-sync.store";
import "./dev";

watch(npcSyncStore, (npcSync) => {
  for (const [id] of npcSync.streamedNpcs) {
    if (!npcSync.streamedIn.some((npc) => npc.id === id)) {
      npcSync.despawn(id);
    }
  }
  npcSync.streamedIn.forEach(async (npc) => {
    const streamedNpc = npcSync.streamedNpcs.has(npc.id)
      ? npcSync.streamedNpcs.get(npc.id)
      : npcSync.spawn(npc);

    if (!streamedNpc) {
      return;
    }

    await streamedNpc.syncWithServer();

    if (streamedNpc.runningTask !== streamedNpc.npc.currentTask) {
      if (streamedNpc.npc.currentTask) {
        streamedNpc.runCurrentTask();
      } else {
        streamedNpc.stopRunningTask();
      }
    }
  });
});
