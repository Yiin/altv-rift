<script setup lang="ts">
import { Icon as IconifyIcon } from "@iconify/vue";
import { computed } from "vue";
import { rem } from "@/composables/use-pixel";
import { asset } from "@/lib/utils";

interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
}

const props = defineProps<IconProps>();

const isInventoryIcon = computed(() => props.name.startsWith("inventory:"));
const iconName = computed(() =>
  props.name.includes(":") ? props.name.replace("inventory:", "") : `local:${props.name}`,
);

const dimensions = computed(() =>
  props.size
    ? {
        width: rem(props.size),
        height: rem(props.size),
      }
    : null,
);
</script>

<template>
  <div
    v-if="isInventoryIcon"
    class="bg-contain bg-center bg-no-repeat"
    v-bind="{ ...$attrs, ...dimensions }"
    :style="{
      backgroundImage: `url(${asset(`/assets/inventory/${iconName}.webp`)})`,
    }"
  />
  <IconifyIcon
    v-else
    :icon="iconName"
    v-bind="{
      width: '100%',
      height: '100%',
      ...$attrs,
      ...dimensions,
    }"
  />
</template>
