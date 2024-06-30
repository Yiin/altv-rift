<script setup lang="ts">
import { onMounted } from "vue";
import { ClientEvents } from "@shared/events/client";
import { notify, Notification, NotificationGroup } from "./notiwind";
import { useEventListener } from "./composables/use-event-listener";
import { useSceneManager } from "./composables/use-scene-manager";
import { useSyncedStores } from "./composables/use-synced-stores";

import NotificationCard from './components/NotificationCard.vue'

window.addEventListener("error", (e) => {
  if (e instanceof ErrorEvent) {
    console.error(e.message, e.filename, e.lineno, e.colno);
  }
});

useSceneManager();
useSyncedStores();

useEventListener(
  "focus",
  (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      alt.emit(ClientEvents.FromWebview.INPUT_FOCUS, true);
    }
  },
  true,
);

useEventListener(
  "blur",
  (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      alt.emit(ClientEvents.FromWebview.INPUT_FOCUS, false);
    }
  },
  true,
);

console.log("App.vue");

onMounted(() => {
  console.log("App mounted");
  alt.emit(ClientEvents.FromWebview.VIEW_READY);
  notify({
    type: "error",
    text: "Amet mollit velit occaecat reprehenderit officia",
  }, 7000);
  notify({
    type: "success",
    text: "Pariatur laboris cupidatat non dolore id",
  }, 1500);
  notify({
    type: "info",
    text: "Lorem consequat fugiat est consequat",
  }, 4500);
  notify({
    type: "warning",
    text: "Consequat aliquip magna quis voluptate amet et ipsum adipisicing Laboris incididunt enim cupidatat aute mollit incididunt nostrud est.",
  }, 3000);
});
</script>

<template>
  <NotificationGroup>
    <div class="fixed top-0 right-0 z-10 grid items-start justify-end w-full max-w-md gap-2 p-6">
      <Notification
        v-slot="{ notifications }"
        enter="transform ease-out duration-300 transition"
        enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
        enter-to="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
        move="transition duration-500"
        move-delay="delay-300"
      >
        <NotificationCard
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
        />
      </Notification>
    </div>
  </NotificationGroup>
  
  <v-app>
    <v-main class="relative select-none">
      <router-view />
    </v-main>
  </v-app>
</template>
