<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { throttle } from "lodash-es";

const props = withDefaults(
  defineProps<{
    labelLeft?: string;
    labelRight?: string;
    size?: number;
    pointerSize?: number;
    modelValue?: number;
  }>(),
  {
    size: 150,
    pointerSize: 24,
    modelValue: 0,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const container = ref();
const x = ref(denormalize(props.modelValue));

const bounds = ref({
  x: 0,
});

watchEffect(() => {
  updateBounds();
});

watch(
  () => props.modelValue,
  (value) => {
    x.value = denormalize(value);
  }
);

function normalize(value: number) {
  const full = props.pointerSize;
  return (value / (props.size - full)) * 2 - 1;
}

function denormalize(value: number) {
  const full = props.pointerSize;
  return ((value + 1) * (props.size - full)) / 2;
}

const updateModelValue = throttle((x) => {
  emit("update:modelValue", normalize(x));
}, 60);

watchEffect(() => {
  updateModelValue(x.value);
});

function updateBounds() {
  if (!container.value?.$el) {
    return;
  }
  bounds.value = container.value.$el.getBoundingClientRect();
}

function cleanup() {
  window.removeEventListener("pointermove", trackDragging);
  window.removeEventListener("pointerup", cleanup);
}

function dragstart(e: PointerEvent) {
  e.preventDefault();
  updateBounds();
  window.addEventListener("pointerup", cleanup);
  window.addEventListener("pointermove", trackDragging);
}

function trackDragging(e: PointerEvent) {
  const half = props.pointerSize / 2;

  x.value =
    Math.max(half, Math.min(props.size - half, e.clientX - bounds.value.x)) -
    half;
}
</script>

<template>
  <div class="p-6 flex justify-center items-center">
    <v-sheet
      ref="container"
      @pointerdown="dragstart"
      color="grey-darken-4"
      class="overflow-visible relative border-solid border-1-gray-600 border-1"
      rounded
      height="30"
      width="150"
    >
      <!-- Vertical lines -->
      <div
        v-for="left in ['left-1/5', 'left-2/5', 'left-3/5', 'left-4/5']"
        :class="[
          left,
          'absolute left-1/5 h-full border-solid border-l-gray-600 border-l-1',
        ]"
      />

      <!-- Pointer -->
      <v-icon
        ref="pointer"
        class="absolute z-10 top-1/2 -translate-y-1/2"
        :style="{ left: x + 'px' }"
        icon="mdi-circle"
      />

      <!-- Labels -->
      <span
        class="absolute -translate-x-full -translate-y-1/2 -left-2 top-1/2 text-xs"
        >{{ props.labelLeft }}</span
      >
      <span
        class="absolute translate-x-full -translate-y-1/2 -right-2 top-1/2 text-xs"
        >{{ props.labelRight }}</span
      >
    </v-sheet>
  </div>
</template>
