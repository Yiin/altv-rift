<script setup lang="ts">
import { clamp } from "lodash";
import { computed } from "vue";
import Focusable from "./Focusable.vue";

const props = defineProps<{
  options: any[];
  modelValue: any;
  useIndexAsValue?: boolean;
  label?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const selected = computed(() =>
  props.useIndexAsValue
    ? props.modelValue
    : props.options.indexOf(props.modelValue)
);

const visibleOptions = computed(() => {
  // 7 visible colors
  const visible = 7;
  const start = clamp(
    selected.value - Math.floor(visible / 2),
    0,
    props.options.length - visible
  );
  return props.options.slice(start, start + visible);
});

function prev() {
  const index = clamp(selected.value - 1, 0, props.options.length - 1);
  emit(
    "update:modelValue",
    props.useIndexAsValue ? index : props.options[index]
  );
}

function next() {
  const index = clamp(selected.value + 1, 0, props.options.length - 1);
  emit(
    "update:modelValue",
    props.useIndexAsValue ? index : props.options[index]
  );
}

function handleKeydown({ key }: KeyboardEvent) {
  if (key === "ArrowLeft") {
    prev();
  } else if (key === "ArrowRight") {
    next();
  }
}
</script>

<template>
  <Focusable @keydown="handleKeydown">
    <div v-if="label" class="text-xs pb-2 uppercase tracking-wide">
      {{ label }}
    </div>
    <div class="flex justify-center items-center">
      <v-btn icon="mdi-chevron-left" size="x-small" @click="prev" />
      <div class="flex flex-wrap items-center gap-0.5 w-40 mx-2">
        <div
          v-for="option in visibleOptions"
          :class="[
            'border border-black outline outline-1 outline-gray-400',
            selected === options.indexOf(option)
              ? 'h-10 w-10 z-30'
              : Math.abs(options.indexOf(option) - selected) <= 1
              ? 'h-8 w-8 z-20'
              : Math.abs(options.indexOf(option) - selected) <= 2
              ? 'h-6 w-6 z-10'
              : 'h-4 w-4',
            options.indexOf(option) - selected > 0 && '-ml-1.5',
            options.indexOf(option) - selected < 0 && '-mr-1.5',
          ]"
          :style="{ backgroundColor: option.hex }"
        />
      </div>
      <v-btn icon="mdi-chevron-right" size="x-small" @click="next" />
    </div>
  </Focusable>
</template>
