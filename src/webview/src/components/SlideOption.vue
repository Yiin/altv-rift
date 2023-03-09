<script setup lang="ts">
import { computed, ref } from "vue";
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
  emit(
    "update:modelValue",
    props.options[wrap(current.value - 1, props.options.length)]
  );
};

const next = () => {
  emit(
    "update:modelValue",
    props.options[wrap(current.value + 1, props.options.length)]
  );
};
</script>

<template>
  <div class="flex justify-center items-center">
    <v-btn icon="mdi-chevron-left" size="x-small" @click="prev" />
    <div
      class="flex justify-center items-center flex-col v-btn min-w-20 text-sm"
    >
      <span
        v-for="(option, index) in options"
        :class="['px-2', current !== index && 'invisible h-0']"
      >
        {{ props.valueText?.(option) ?? option }}
      </span>
    </div>
    <v-btn icon="mdi-chevron-right" size="x-small" @click="next" />
  </div>
</template>
