<script setup lang="ts">
import { usePlayerStore } from "@shared/store/player.store";
import { updateStoreState } from "@shared/store/utils";
import { onMounted } from "vue";
import { Events } from "../../shared/constants/events";
import { useAlt } from "./composables/use-alt";
import { useEventListener } from "./composables/use-event-listener";
import { useSceneManager } from "./composables/use-scene-manager";

useSceneManager();
const { on } = useAlt();
const playerStore = usePlayerStore();

useEventListener(
  "focus",
  (e) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      alt.emit(Events.Client.INPUT_FOCUS, true);
    }
  },
  true
);

useEventListener(
  "blur",
  (e) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      alt.emit(Events.Client.INPUT_FOCUS, false);
    }
  },
  true
);

on(WebviewEvents.FromClient.UPDATE_STATE, (event: any) => {
  updateStoreState(playerStore, event);
});

onMounted(() => {
  alt.emit(ClientEvents.FromWebview.VIEW_READY);
});
</script>

<template>
  <v-app>
    <v-main class="relative select-none">
      <router-view />
    </v-main>
  </v-app>
</template>
