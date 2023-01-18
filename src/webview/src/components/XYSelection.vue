<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { throttle } from "lodash-es";

const props = withDefaults(
  defineProps<{
    labelTop?: string;
    labelBottom?: string;
    labelLeft?: string;
    labelRight?: string;
    x?: number;
    y?: number;
    size?: number;
    pointerSize?: number;
  }>(),
  {
    x: 0,
    y: 0,
    size: 150,
    pointerSize: 24,
  }
);

const emit = defineEmits<{
  (e: "update:x", value: number): void;
  (e: "update:y", value: number): void;
}>();

const container = ref();
const pointer = ref();
const x = ref(denormalize(props.x));
const y = ref(denormalize(props.y));

const bounds = ref({
  x: 0,
  y: 0,
});

watchEffect(() => {
  updateBounds();
});

watch([() => props.x, () => props.y], (xy) => {
  [x.value, y.value] = xy.map(denormalize);
});

function normalize(value: number) {
  const half = props.pointerSize / 2;
  const quarter = props.pointerSize / 4;
  return ((value + quarter) / (props.size - half)) * 2 - 1;
}

function denormalize(value: number) {
  const half = props.pointerSize / 2;
  const quarter = props.pointerSize / 4;
  return ((value + 1) * (props.size - half)) / 2 - quarter;
}

const updateModelValue = throttle((x, y) => {
  emit("update:x", normalize(x));
  emit("update:y", normalize(y));
}, 60);

watchEffect(() => {
  updateModelValue(x.value, y.value);
});

function updateBounds() {
  if (!container.value?.$el || !pointer.value?.$el) {
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
  const quarter = props.pointerSize / 4;

  x.value =
    Math.max(
      0 + quarter,
      Math.min(props.size - quarter, e.clientX - bounds.value.x)
    ) - half;
  y.value =
    Math.max(
      0 + quarter,
      Math.min(props.size - quarter, e.clientY - bounds.value.y)
    ) - half;
}
</script>

<template>
  <div class="p-6 flex justify-center items-center">
    <v-sheet
      ref="container"
      @pointerdown="dragstart"
      color="grey-darken-4"
      class="overflow-visible relative border-solid border-gray-600 border-1"
      rounded
      :height="size"
      :width="size"
    >
      <!-- Horizontal lines -->
      <div
        v-for="top in ['top-1/5', 'top-2/5', 'top-3/5', 'top-4/5']"
        :class="[
          top,
          'absolute w-full border-solid border-b-gray-600 border-b-1',
        ]"
      />

      <!-- Vertical lines -->
      <div
        v-for="left in ['left-1/5', 'left-2/5', 'left-3/5', 'left-4/5']"
        :class="[
          left,
          'absolute h-full border-solid border-l-gray-600 border-l-1',
        ]"
      />

      <!-- Pointer -->
      <v-icon
        ref="pointer"
        class="absolute z-10"
        :size="pointerSize"
        :style="{ left: x + 'px', top: y + 'px' }"
        icon="mdi-circle"
      />

      <!-- Labels -->
      <span
        class="absolute -translate-x-full -translate-y-1/2 -left-2 top-1/2 text-xs"
        >{{ props.labelLeft }}</span
      >
      <span
        class="absolute -translate-y-full -translate-x-1/2 left-1/2 -top-2 text-xs"
        >{{ props.labelTop }}</span
      >
      <span
        class="absolute translate-x-full -translate-y-1/2 -right-2 top-1/2 text-xs"
        >{{ props.labelRight }}</span
      >
      <span
        class="absolute translate-y-full -translate-x-1/2 left-1/2 -bottom-2 text-xs"
        >{{ props.labelBottom }}</span
      >
    </v-sheet>
  </div>
</template>
