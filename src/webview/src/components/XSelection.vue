<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { clamp, throttle } from "lodash-es";
import { usePixel } from "@/composables/use-pixel";

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
  }>(),
  {
    modelValue: 0,
    min: -1,
    max: 1,
  }
);
const px = usePixel();

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
  }
);

function normalize(value: number) {
  const full = pointerSize.value;
  return clamp(
    (value / (size.value - full)) * (props.max - props.min) + props.min,
    props.min,
    props.max
  );
}

function denormalize(value: number) {
  const full = pointerSize.value;
  return clamp(
    ((value - props.min) * (size.value - full)) / (props.max - props.min),
    0,
    size.value - full
  );
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

  x.value =
    Math.max(half, Math.min(size.value - half, e.clientX - bounds.value.x)) -
    half;
}
</script>

<template>
  <div :class="['flex justify-center items-center', !noPadding && 'p-6']">
    <v-sheet
      ref="container"
      @pointerdown="dragstart"
      color="grey-darken-4"
      class="overflow-visible relative border-solid border-1-gray-600 border-1"
      rounded
      height="30"
      :width="size"
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
        :class="[
          'absolute z-10 top-1/2 -translate-y-1/2 transform',
          !isDragging && 'transition-transform duration-100 ease-linear',
        ]"
        :style="{
          '--tw-translate-x': `${x}px`,
        }"
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
