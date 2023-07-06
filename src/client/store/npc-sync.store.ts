import game from "natives";
import { defineStore } from "pinia";
import { usePlayerStore } from "@shared/store/player.store";
import { Npc } from "@shared/modules/npc/npc";
import { StreamedNpc } from "@/modules/npc/ped";
import { pinia } from ".";

const useNpcSyncStore = defineStore("npc", {
  state: () => ({
    streamedInNpcs: new Map<Npc["id"], StreamedNpc>(),
  }),
  getters: {
    streamedIn() {
      return usePlayerStore().$state.sync.npc.streamedIn;
    },
    netOwnerOf() {
      return usePlayerStore().$state.sync.npc.netOwnerOf;
    },
  },
  actions: {
    spawn(npc: Npc) {
      const streamedNpc = new StreamedNpc(npc);
      this.streamedInNpcs.set(npc.id, streamedNpc);
      return streamedNpc;
    },
    despawn(id: Npc["id"]) {
      const streamedNpc = this.streamedInNpcs.get(id);
      if (streamedNpc) {
        game.deletePed(streamedNpc.ped);
        this.streamedInNpcs.delete(id);
      }
    },
  },
});

export const npcSyncStore = useNpcSyncStore(pinia);
