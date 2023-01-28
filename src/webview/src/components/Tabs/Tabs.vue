<script setup lang="ts">
import { ref } from "vue";
import { useEventListener } from "../../composables/use-event-listener";
import { useFrame } from "../../composables/use-frame";
import { useKeyboard } from "../../composables/use-keyboard";
import { wrap } from "../../utils/wrap";
import Focusable from "../Focusable.vue";

const props = defineProps<{
  options: string[];
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const isFocused = ref(false);

const keys = useKeyboard();

useEventListener(
  "keydown",
  (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      emit(
        "update:modelValue",
        wrap(props.modelValue - 1, props.options.length)
      );
    } else if (e.key === "ArrowRight") {
      emit(
        "update:modelValue",
        wrap(props.modelValue + 1, props.options.length)
      );
    }
  },
  { isActive: isFocused }
);
</script>

<template>
  <Focusable v-model="isFocused">
    <v-tabs
      :model-value="props.modelValue"
      @update:model-value="(value) => emit('update:modelValue', value as number)"
      fixed-tabs
    >
      <v-tab v-for="tab in options">
        {{ tab }}
      </v-tab>
    </v-tabs>
  </Focusable>
</template>
