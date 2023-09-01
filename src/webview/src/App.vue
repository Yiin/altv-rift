<script setup lang="ts">
import { ClientEvents } from "@shared/events/client";
import { onMounted } from "vue";
import { useEventListener } from "./composables/use-event-listener";
import { useSceneManager } from "./composables/use-scene-manager";
import { useSyncedStores } from "./composables/use-synced-stores";

useSceneManager();
useSyncedStores();

useEventListener(
  "focus",
  (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      alt.emit(ClientEvents.FromWebview.INPUT_FOCUS, true);
    }
  },
  true
);

useEventListener(
  "blur",
  (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      alt.emit(ClientEvents.FromWebview.INPUT_FOCUS, false);
    }
  },
  true
);

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
