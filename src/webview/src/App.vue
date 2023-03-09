<script setup lang="ts">
import { usePlayerStore } from "@shared/store/player.store";
import { updateStoreState } from "@shared/store/utils";
import { onMounted, onUnmounted, ref } from "vue";
import { Events } from "../../shared/constants/events";
import { useEventListener } from "./composables/use-event-listener";
import { useSceneManager } from "./composables/use-scene-manager";

useSceneManager();

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

function updateState(event: any) {
  updateStoreState(playerStore, event);
}

onMounted(() => {
  alt.on(Events.Webview.UPDATE_STATE, updateState);
  alt.emit(Events.Webview.VIEW_READY);
});

onUnmounted(() => {
  alt.off(Events.Webview.UPDATE_STATE, updateState);
});
</script>

<template>
  <v-app>
    <v-main class="relative select-none">
      <router-view />
    </v-main>
  </v-app>
</template>
