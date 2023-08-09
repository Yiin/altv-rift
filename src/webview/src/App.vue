<script setup lang="ts">
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { usePlayerStore } from "@shared/store/player.store";
import { updateStoreState } from "@shared/store/utils";
import { onMounted, ref } from "vue";
import { useAlt } from "./composables/use-alt";
import { useEventListener } from "./composables/use-event-listener";
import { useSceneManager } from "./composables/use-scene-manager";
import { useClient } from "./store/client.store";

useSceneManager();
const { on } = useAlt();
const playerStore = usePlayerStore();
const clientStore = useClient();

useEventListener(
  "focus",
  (e) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      alt.emit(ClientEvents.FromWebview.INPUT_FOCUS, true);
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
      alt.emit(ClientEvents.FromWebview.INPUT_FOCUS, false);
    }
  },
  true
);

on(WebviewEvents.FromClient.UPDATE_PLAYER_STATE, (event: any) => {
  updateStoreState(playerStore, event);
});

on(WebviewEvents.FromClient.SET_CLIENT_STATE, (state: any) => {
  clientStore.$state = state;
});

on(WebviewEvents.FromClient.UPDATE_CLIENT_STATE, (event: any) => {
  /// @ts-expect-error clientStore state is marked as read-only, but only in types
  updateStoreState(clientStore, event);
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
