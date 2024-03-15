<script setup lang="ts">
const props = defineProps<{
  options: string[];
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
</script>

<template>
  <v-tabs
    :model-value="props.modelValue"
    @update:model-value="(value) => emit('update:modelValue', value as number)"
    fixed-tabs
  >
    <v-tab
      v-for="tab in options"
      :key="tab"
    >
      {{ tab }}
    </v-tab>
  </v-tabs>
</template>
