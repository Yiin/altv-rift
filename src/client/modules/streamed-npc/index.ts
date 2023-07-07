import { watch } from "vue";
import { npcSyncStore } from "@/store/npc-sync.store";

watch(npcSyncStore, (npcSync) => {
  for (const [id] of npcSync.streamedInNpcs) {
    if (!npcSync.streamedIn.some((npc) => npc.id === id)) {
      npcSync.despawn(id);
    }
  }
  npcSync.streamedIn.forEach(async (npc) => {
    const streamedNpc = npcSync.streamedInNpcs.has(npc.id)
      ? npcSync.streamedInNpcs.get(npc.id)
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
