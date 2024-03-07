<script setup lang="ts">
import { onUnmounted } from 'vue';
import { ref } from 'vue';

const props = defineProps<{
  startedAt: number;
  durationMs: number;
  target: number; // 0-1
}>();

const currentTime = ref(Date.now());

const isMounted = ref(true);

onUnmounted(() => {
  isMounted.value = false;
});

requestAnimationFrame(function update() {
  console.log("update", Date.now());
  currentTime.value = Math.min(Date.now(), props.startedAt + props.durationMs);

  if (isMounted.value) {
    requestAnimationFrame(update);
  }
});
</script>

<template>
  <div class="absolute w-full h-full flex items-center justify-center">
    <div class="relative w-135 h-4 bg-white">
      <div class="absolute w-4 h-8 bg-red-600" :style="{
        left: `${target * 100}%`,
        transform: 'translateX(-50%)',
      }"></div>
      <div class="absolute w-4 h-4 bg-blue-600" :style="{
        left: `${((currentTime - startedAt) / durationMs) * 100}%`,
        transform: 'translateX(-50%)',
      }"></div>
    </div>
  </div>
</template>
