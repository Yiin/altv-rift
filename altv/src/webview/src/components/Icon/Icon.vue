<script setup lang="ts">
import { rem } from "@/composables/use-pixel";
import { useSvgIcon } from "@/composables/use-svg-icon";

interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 32,
});

const svgContent = useSvgIcon(props.name);
</script>

<template>
  <div
    :style="{ width: rem(width || size), height: rem(height || size) }"
    v-html="svgContent"
  />
</template>
