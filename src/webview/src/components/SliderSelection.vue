<script setup lang="ts">
import { clamp } from "lodash";
import { computed, ref } from "vue";
import { useFocus } from "../composables/use-focus";
import { useEventListener } from "../composables/use-event-listener";
import Focusable from "./Focusable.vue";

const props = defineProps<{
  options: any[];
  modelValue: any;
  useIndexAsValue?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

function handleInteraction({ key }: KeyboardEvent) {
  if (key === "ArrowLeft") {
    prev();
  } else if (key === "ArrowRight") {
    next();
  }
}

const selected = computed(() =>
  props.useIndexAsValue
    ? props.modelValue
    : props.options.indexOf(props.modelValue)
);

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
</script>

<template>
  <Focusable @keydown="handleInteraction" class="mb-2">
    <div class="flex justify-center items-center gap-4">
      <v-btn
        icon="mdi-chevron-left"
        variant="tonal"
        :disabled="selected === 0"
        @click="prev"
      />
      <div
        class="flex justify-center items-center flex-col v-btn min-w-20 text-sm"
      >
        <span
          v-for="(option, index) in options"
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
  </Focusable>
</template>
