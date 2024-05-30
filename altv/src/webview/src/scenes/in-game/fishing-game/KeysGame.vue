<script setup lang="ts">
defineProps<{
  startedAt: number;
  durationMs: number;
  keys: number[];
  pressedKeys: number[];
}>();

const letters: Record<number, string> = {
  65: "A",
  68: "D",
  83: "S",
  87: "W",
};
</script>

<template>
  <div class="absolute flex h-full w-full items-center justify-center">
    <pre class="font-xl crisp-shadow font-extrabold text-white">{{
      JSON.stringify(keys.map((key) => letters[key]))
    }}</pre>
    <br />
    <pre class="font-xl crisp-shadow font-extrabold text-white">{{
      JSON.stringify(pressedKeys.map((key) => letters[key]))
    }}</pre>
  </div>
</template>
