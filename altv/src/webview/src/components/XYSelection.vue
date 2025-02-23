<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { clamp, throttle } from "lodash-es";
import { px } from "@/composables/use-pixel";
import { cn } from "@/lib/utils";

const modelX = defineModel<number>("x", { default: 0 });
const modelY = defineModel<number>("y", { default: 0 });

const props = withDefaults(
  defineProps<{
    labelTop?: string;
    labelBottom?: string;
    labelLeft?: string;
    labelRight?: string;
    size?: number;
    pointerSize?: number;
    reverseX?: boolean;
    reverseY?: boolean;
  }>(),
  {
    size: 150,
    pointerSize: 24,
  },
);

const size = computed(() => px(props.size ?? 150));
const pointerSize = computed(() => px(props.pointerSize ?? 24));

const container = ref();
const pointer = ref();
const x = ref(denormalize(props.reverseX ? -modelX.value : modelX.value));
const y = ref(denormalize(props.reverseY ? -modelY.value : modelY.value));
const isDragging = ref(false);

const bounds = ref({
  x: 0,
  y: 0,
});

const updateModelValue = throttle((x, y) => {
  modelX.value = props.reverseX ? -normalize(x) : normalize(x);
  modelY.value = props.reverseY ? -normalize(y) : normalize(y);
}, 60);

watchEffect(() => {
  updateBounds();
});

watch([x, y], ([newX, newY]) => {
  updateModelValue(newX, newY);
});

watchEffect(() => {
  x.value = denormalize(props.reverseX ? -modelX.value : modelX.value);
  y.value = denormalize(props.reverseY ? -modelY.value : modelY.value);
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

function updateBounds() {
  if (!container.value) {
    return;
  }

  bounds.value = container.value.getBoundingClientRect();
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
    Math.max(0 + quarter, Math.min(size.value - quarter, e.clientX - bounds.value.x)) - half;
  y.value =
    Math.max(0 + quarter, Math.min(size.value - quarter, e.clientY - bounds.value.y)) - half;
}
</script>

<template>
  <div class="flex items-center justify-center p-6">
    <div
      ref="container"
      @pointerdown="dragstart"
      class="relative overflow-visible rounded-md border border-border bg-neutral-900"
      :style="{
        // px because it's already adjusted to be responsive
        height: `${size}px`,
        width: `${size}px`,
      }"
    >
      <!-- Horizontal lines -->
      <div
        v-for="(_, index) in 4"
        :key="'h' + index"
        :class="
          cn(
            'absolute w-full border-b border-border border-neutral-700',
            index === 0 && 'top-1/5',
            index === 1 && 'top-2/5',
            index === 2 && 'top-3/5',
            index === 3 && 'top-4/5',
          )
        "
      />

      <!-- Vertical lines -->
      <div
        v-for="(_, index) in 4"
        :key="'v' + index"
        :class="
          cn(
            'absolute h-full border-l border-border border-neutral-700',
            index === 0 && 'left-1/5',
            index === 1 && 'left-2/5',
            index === 2 && 'left-3/5',
            index === 3 && 'left-4/5',
          )
        "
      />

      <!-- Pointer -->
      <div
        ref="pointer"
        :class="[
          'absolute z-10 transform rounded-full bg-primary',
          !isDragging && 'transition-transform duration-100 ease-linear',
        ]"
        :style="{
          '--tw-translate-x': `${x}px`,
          '--tw-translate-y': `${y}px`,
          // px because it's already adjusted to be responsive
          width: `${pointerSize}px`,
          height: `${pointerSize}px`,
        }"
      />

      <!-- Labels -->
      <span
        class="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 text-xs text-muted-foreground"
      >
        {{ reverseX ? labelRight : labelLeft }}
      </span>
      <span
        class="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full text-xs text-muted-foreground"
      >
        {{ reverseY ? labelBottom : labelTop }}
      </span>
      <span
        class="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-xs text-muted-foreground"
      >
        {{ reverseX ? labelLeft : labelRight }}
      </span>
      <span
        class="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-xs text-muted-foreground"
      >
        {{ reverseY ? labelTop : labelBottom }}
      </span>
    </div>
  </div>
</template>
