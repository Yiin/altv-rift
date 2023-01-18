<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  options: any[];
  modelValue: any;
  valueText?: any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const current = computed(() => props.options.indexOf(props.modelValue));

const prev = () => {
  emit(
    "update:modelValue",
    props.options[
      current.value - 1 < 0 ? props.options.length - 1 : current.value - 1
    ]
  );
};

const next = () => {
  emit(
    "update:modelValue",
    props.options[
      current.value + 1 > props.options.length - 1 ? 0 : current.value + 1
    ]
  );
};
</script>

<template>
  <div class="flex justify-between items-center w-100">
    <v-btn icon="mdi-chevron-left" size="x-small" @click="prev" />
    <span class="px-3">{{ props.valueText ?? props.modelValue }}</span>
    <v-btn icon="mdi-chevron-right" size="x-small" @click="next" />
  </div>
</template>
