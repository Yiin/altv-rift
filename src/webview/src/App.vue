<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Events } from "../../shared/constants/events";
import { useSceneManager } from "./composables/use-scene-manager";

useSceneManager();

const debug = ref<any>({});

onMounted(() => {
  if ("alt" in window) {
    alt.emit(Events.Webview.VIEW_READY);
    alt.on(Events.Webview.DEBUG, (data) => {
      debug.value = data;
    });
  }
});
</script>

<template>
  <v-app>
    <div class="absolute p-5 text-white drop-shadow-[0_0_0_rgba(0,0,0,1)]">
      <div
        v-for="line of Object.entries(debug).map(
          ([key, value]) => `${key}: ${value}`
        )"
      >
        {{ line }}
      </div>
    </div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
