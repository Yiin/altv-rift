<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { clamp, throttle } from "lodash-es";
import { px } from "@/composables/use-pixel";

const props = withDefaults(
  defineProps<{
    labelLeft?: string;
    labelRight?: string;
    size?: number;
    pointerSize?: number;
    modelValue?: number;
    noPadding?: boolean;
    min?: number;
    max?: number;
    reverse?: boolean;
  }>(),
  {
    modelValue: 0,
    min: -1,
    max: 1,
  },
);

const size = computed(() => px(props.size ?? 150));
const pointerSize = computed(() => px(props.pointerSize ?? 24));

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const container = ref();
const x = ref(denormalize(props.modelValue));
const isDragging = ref(false);

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
  },
);

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

const updateModelValue = throttle((x) => {
  const value = props.reverse ? props.min + props.max - normalize(x) : normalize(x);
  emit("update:modelValue", value);
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

  x.value = Math.max(half, Math.min(size.value - half, e.clientX - bounds.value.x)) - half;
}
</script>

<template>
  <div :class="['flex items-center justify-center', !noPadding && 'p-6']">
    <v-sheet
      ref="container"
      @pointerdown="dragstart"
      color="grey-darken-4"
      class="border-1-neutral-600 relative overflow-visible border-1 border-solid"
      rounded
      height="30"
      :width="size"
    >
      <!-- Vertical lines -->
      <div
        v-for="left in ['left-1/5', 'left-2/5', 'left-3/5', 'left-4/5']"
        :key="left"
        :class="[left, 'absolute left-1/5 h-full border-l-1 border-solid border-l-neutral-600']"
      />

      <!-- Pointer -->
      <v-icon
        ref="pointer"
        :class="[
          'absolute top-1/2 z-10 -translate-y-1/2 transform',
          !isDragging && 'transition-transform duration-100 ease-linear',
        ]"
        :style="{
          '--tw-translate-x': `${x}px`,
        }"
        icon="mdi-circle"
      />

      <!-- Labels -->
      <span class="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 text-xs">
        {{ reverse ? labelRight : labelLeft }}
      </span>
      <span class="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-xs">
        {{ reverse ? labelLeft : labelRight }}
      </span>
    </v-sheet>
  </div>
</template>
