<script setup lang="ts">
import { onMounted } from "vue";
import { useSceneManager } from "./composables/use-scene-manager";

useSceneManager();

onMounted(() => {
  if ("alt" in window) {
    alt.emit("view:ready");
  }
});
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
