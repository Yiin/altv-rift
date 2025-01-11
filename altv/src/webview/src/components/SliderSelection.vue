<script setup lang="ts">
import { clamp } from "lodash";
import { computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  options: any[];
  modelValue: any;
  useIndexAsValue?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const selected = computed(() =>
  props.useIndexAsValue ? props.modelValue : props.options.indexOf(props.modelValue),
);

function prev() {
  const index = selected.value - 1 <= 0 ? props.options.length - 1 : selected.value - 1;
  emit("update:modelValue", props.useIndexAsValue ? index : props.options[index]);
}

function next() {
  const index = selected.value + 1 >= props.options.length ? 0 : selected.value + 1;
  emit("update:modelValue", props.useIndexAsValue ? index : props.options[index]);
}
</script>

<template>
  <div class="mb-2">
    <div class="flex items-center justify-center gap-4">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700"
        @click="prev"
      >
        <Icon
          icon="mdi:chevron-left"
          width="1.5rem"
          height="1.5rem"
        />
      </button>
      <div class="v-btn flex min-w-20 flex-col items-center justify-center text-sm">
        <span
          v-for="(option, index) in options"
          :key="index"
          :class="selected !== index && 'invisible h-0'"
        >
          {{ option }}
        </span>
      </div>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700"
        @click="next"
      >
        <Icon
          icon="mdi:chevron-right"
          width="1.5rem"
          height="1.5rem"
        />
      </button>
    </div>
  </div>
</template>
