<script setup lang="ts">
import Screen from "@/components/Screen.vue";
import { useClient } from "@/store/client.store";

const client = useClient();
const console = window.console;
</script>

<template>
  <Screen>
    <div
      v-for="element of client.worldUIElements"
      :key="element.id"
      class="absolute top-0 left-0 text-white text-2xl p-3"
      :style="{
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        transform: `translate(${element.pos.x}px, ${element.pos.y}px) perspective(500px) rotateY(${element.pos.skewX}deg) rotateX(${element.pos.skewZ}deg)`,
        transformOrigin: `center`,
        scale: element.pos.scale,
      }"
    >
      Element: {{ element.id }}
    </div>
  </Screen>
</template>
