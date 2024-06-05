<script setup lang="ts">
import { rem } from "@/composables/use-pixel";

interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
}

withDefaults(defineProps<IconProps>(), {
  size: 32,
});
</script>

<template>
  <div
    class="bg-contain"
    :style="{
      backgroundImage: `url(./assets/icons/${name}.svg)`,
      width: rem(width || size),
      height: rem(height || size),
    }"
  />
</template>
