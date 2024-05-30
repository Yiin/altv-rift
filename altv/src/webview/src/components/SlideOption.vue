<script setup lang="ts">
import { computed } from "vue";
import { wrap } from "../utils/wrap";

const props = defineProps<{
  options: any[];
  modelValue: any;
  valueText?: (value: any) => any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const current = computed(() => props.options.indexOf(props.modelValue));

const prev = () => {
  emit("update:modelValue", props.options[wrap(current.value - 1, props.options.length)]);
};

const next = () => {
  emit("update:modelValue", props.options[wrap(current.value + 1, props.options.length)]);
};
</script>

<template>
  <div class="flex items-center justify-center">
    <v-btn
      icon="mdi-chevron-left"
      size="x-small"
      @click="prev"
    />
    <div class="v-btn flex min-w-20 flex-col items-center justify-center text-sm">
      <span
        v-for="(option, index) in options"
        :key="index"
        :class="['px-2', current !== index && 'invisible h-0']"
      >
        {{ props.valueText?.(option) ?? option }}
      </span>
    </div>
    <v-btn
      icon="mdi-chevron-right"
      size="x-small"
      @click="next"
    />
  </div>
</template>
