<script setup lang="ts">
import { clamp } from "lodash";
import { computed } from "vue";

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
  const index = clamp(selected.value - 1, 0, props.options.length - 1);
  emit("update:modelValue", props.useIndexAsValue ? index : props.options[index]);
}

function next() {
  const index = clamp(selected.value + 1, 0, props.options.length - 1);
  emit("update:modelValue", props.useIndexAsValue ? index : props.options[index]);
}
</script>

<template>
  <div class="mb-2">
    <div class="flex items-center justify-center gap-4">
      <v-btn
        icon="mdi-chevron-left"
        variant="tonal"
        :disabled="selected === 0"
        @click="prev"
      />
      <div class="v-btn flex min-w-20 flex-col items-center justify-center text-sm">
        <span
          v-for="(option, index) in options"
          :key="index"
          :class="selected !== index && 'invisible h-0'"
        >
          {{ option }}
        </span>
      </div>
      <v-btn
        icon="mdi-chevron-right"
        variant="tonal"
        :disabled="selected === options.length - 1"
        @click="next"
      />
    </div>
  </div>
</template>
