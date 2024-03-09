<script setup lang="ts">
import { defineProps } from "vue";
import { WeaponModuleType } from "./types";

const props = defineProps({
  availableModules: {
    type: Object as () => WeaponModuleType,
    default: {} as WeaponModuleType,
  },
});
</script>

<template>
  <div class="bg-transparent border border-white/10 max-w-md"></div>
</template>
