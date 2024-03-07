<script setup lang="ts">
defineProps<{
  startedAt: number;
  durationMs: number;
  keys: number[];
  pressedKeys: number[];
}>();

const letters: Record<number, string> = {
  65: 'A',
  68: 'D',
  83: 'S',
  87: 'W',
};

</script>

<template>
  <div class="absolute w-full h-full flex items-center justify-center">
    <pre class="font-xl text-white font-extrabold crisp-shadow">{{ JSON.stringify(keys.map(key => letters[key])) }}</pre>
    <br />
    <pre
      class="font-xl text-white font-extrabold crisp-shadow">{{ JSON.stringify(pressedKeys.map(key => letters[key])) }}</pre>
  </div>
</template>
