<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { clamp, throttle } from "lodash-es";
import { px } from "@/composables/use-pixel";
import { cn } from "@/lib/utils";

const model = defineModel<number>({ default: 0 });

const props = withDefaults(
  defineProps<{
    labelLeft?: string;
    labelRight?: string;
    size?: number;
    pointerSize?: number;
    noPadding?: boolean;
    min?: number;
    max?: number;
    reverse?: boolean;
  }>(),
  {
    min: -1,
    max: 1,
  },
);

const size = computed(() => px(props.size ?? 150));
const pointerSize = computed(() => px(props.pointerSize ?? 24));

const container = ref();
const x = ref(denormalize(model.value));
const isDragging = ref(false);

const bounds = ref({
  x: 0,
});

const updateModelValue = throttle((x) => {
  const value = props.reverse ? props.min + props.max - normalize(x) : normalize(x);
  model.value = value;
}, 60);

watchEffect(() => {
  updateBounds();
});

watch(x, () => {
  updateModelValue(x.value);
});

watchEffect(() => {
  x.value = denormalize(model.value);
});

function normalize(value: number) {
  const full = pointerSize.value;
  return clamp(
    (value / (size.value - full)) * (props.max - props.min) + props.min,
    props.min,
    props.max,
  );
}

function denormalize(value: number) {
  value = props.reverse ? props.max + props.min - value : value;

  const full = pointerSize.value;
  return clamp(
    ((value - props.min) * (size.value - full)) / (props.max - props.min),
    0,
    size.value - full,
  );
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
  trackDragging(e);
}

function trackDragging(e: PointerEvent) {
  const half = pointerSize.value / 2;

  x.value = Math.max(half, Math.min(size.value - half, e.clientX - bounds.value.x)) - half;
}
</script>

<template>
  <div :class="['flex items-center justify-center', !noPadding && 'p-6']">
    <div
      ref="container"
      @pointerdown="dragstart"
      class="relative overflow-visible rounded-md border border-border bg-neutral-900"
      :style="{ width: `${size}px`, height: `${px(30)}px` }"
    >
      <!-- Vertical lines -->
      <div
        v-for="(_, index) in 4"
        :key="index"
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
        class="absolute top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-primary"
        :class="!isDragging && 'transition-transform duration-100 ease-linear'"
        :style="{
          '--tw-translate-x': `${x}px`,
          width: `${pointerSize}px`,
          height: `${pointerSize}px`,
        }"
      />

      <!-- Labels -->
      <span
        class="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 text-xs text-muted-foreground"
      >
        {{ reverse ? labelRight : labelLeft }}
      </span>
      <span
        class="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-xs text-muted-foreground"
      >
        {{ reverse ? labelLeft : labelRight }}
      </span>
    </div>
  </div>
</template>
