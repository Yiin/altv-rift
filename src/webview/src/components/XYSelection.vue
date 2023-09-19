<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { clamp, throttle } from "lodash-es";
import { px } from "@/composables/use-pixel";

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

const size = computed(() => px(props.size ?? 150));
const pointerSize = computed(() => px(props.pointerSize ?? 24));

const emit = defineEmits<{
  (e: "update:x", value: number): void;
  (e: "update:y", value: number): void;
}>();

const container = ref();
const pointer = ref();
const x = ref(denormalize(props.x));
const y = ref(denormalize(props.y));
const isDragging = ref(false);

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
  const half = pointerSize.value / 2;
  const quarter = pointerSize.value / 4;
  return clamp(((value + quarter) / (size.value - half)) * 2 - 1, -1, 1);
}

function denormalize(value: number) {
  const half = pointerSize.value / 2;
  const quarter = pointerSize.value / 4;
  return ((clamp(value, -1, 1) + 1) * (size.value - half)) / 2 - quarter;
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
  isDragging.value = false;
  window.removeEventListener("pointermove", trackDragging);
  window.removeEventListener("pointerup", cleanup);
}

function dragstart(e: PointerEvent) {
  e.preventDefault();
  isDragging.value = true;
  updateBounds();
  window.addEventListener("pointerup", cleanup);
  window.addEventListener("pointermove", trackDragging);
}

function trackDragging(e: PointerEvent) {
  const half = pointerSize.value / 2;
  const quarter = pointerSize.value / 4;

  x.value =
    Math.max(
      0 + quarter,
      Math.min(size.value - quarter, e.clientX - bounds.value.x)
    ) - half;
  y.value =
    Math.max(
      0 + quarter,
      Math.min(size.value - quarter, e.clientY - bounds.value.y)
    ) - half;
}
</script>

<template>
  <div class="p-6 flex justify-center items-center">
    <v-sheet ref="container" @pointerdown="dragstart" color="grey-darken-4"
      class="overflow-visible relative border-solid border-neutral-600 border-1" rounded :height="size" :width="size">
      <!-- Horizontal lines -->
      <div v-for="top in ['top-1/5', 'top-2/5', 'top-3/5', 'top-4/5']" :class="[
        top,
        'absolute w-full border-solid border-b-neutral-600 border-b-1',
      ]" />

      <!-- Vertical lines -->
      <div v-for="left in ['left-1/5', 'left-2/5', 'left-3/5', 'left-4/5']" :class="[
        left,
        'absolute h-full border-solid border-l-neutral-600 border-l-1',
      ]" />

      <!-- Pointer -->
      <v-icon ref="pointer" :class="[
        'absolute z-10 transform',
        !isDragging && 'transition-transform duration-100 ease-linear',
      ]" :size="pointerSize" :style="{
  '--tw-translate-x': `${x}px`,
  '--tw-translate-y': `${y}px`,
}" icon="mdi-circle" />

      <!-- Labels -->
      <span class="absolute -translate-x-full -translate-y-1/2 -left-2 top-1/2 text-xs">{{ props.labelLeft }}</span>
      <span class="absolute -translate-y-full -translate-x-1/2 left-1/2 -top-2 text-xs">{{ props.labelTop }}</span>
      <span class="absolute translate-x-full -translate-y-1/2 -right-2 top-1/2 text-xs">{{ props.labelRight }}</span>
      <span class="absolute translate-y-full -translate-x-1/2 left-1/2 -bottom-2 text-xs">{{ props.labelBottom }}</span>
    </v-sheet>
  </div>
</template>
