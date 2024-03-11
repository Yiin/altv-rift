<script setup lang="ts">
import { shallowRef, watchEffect } from "vue";
import type { DefineComponent } from "vue";

interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 2,
});

const iconComponent = shallowRef<DefineComponent | null>(null);

watchEffect(async () => {
  // Convert to PascalCase
  const pascalCaseName = props.name
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
    .replace(/[-_]\w/g, (m) => m[1].toUpperCase());

  const componentName = `${pascalCaseName}Icon`;

  try {
    const componentModule = await import(/* @vite-ignore */ `./${componentName}.vue`);
    iconComponent.value = componentModule.default as DefineComponent;
  } catch (e) {
    console.warn(`Icon component "${componentName}" not found.`);
    iconComponent.value = null;
  }
});
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :style="{ width: `${width || size}rem`, height: `${height || size}rem` }"></component>
</template>
