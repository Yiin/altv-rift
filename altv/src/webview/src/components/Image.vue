<script setup lang="ts">
defineProps<{
  src: string;
}>();
</script>

<template>
  <div v-bind="$attrs">
    <img
      :src="src"
      class="h-full w-full object-contain"
    />
  </div>
</template>
