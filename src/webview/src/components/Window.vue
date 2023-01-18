<script setup lang="ts">
import { onMounted, ref } from "vue";
import VueDragResize from "vue-drag-resize";
import { vClickOutside } from "../directives/click-outside";
import { useWindows } from "../store/windows.store";

const props = withDefaults(
  defineProps<{
    stickSize?: number;
    parentScaleX?: number;
    parentScaleY?: number;
    isActive?: boolean;
    preventActiveBehavior?: boolean;
    isDraggable?: boolean;
    aspectRatio?: boolean;
    parentLimitation?: boolean;
    snapToGrid?: boolean;
    gridX?: number;
    gridY?: number;
    parentW?: number;
    parentH?: number;
    w?: number;
    h?: number;
    minw?: number;
    minh?: number;
    x?: number;
    y?: number;
    dragHandle?: string;
    dragCancel?: string;
    axis?: "x" | "y" | "both" | "none";
    contentClass?: string;
    style?: any;
  }>(),
  {
    isActive: true,
    isDraggable: true,
  }
);

const windows = useWindows();

const z = ref(windows.topIndex++);
const isFocused = ref();

function focus() {
  if (!props.isActive) return;
  isFocused.value = true;
  z.value = windows.topIndex++;
}

function blur() {
  isFocused.value = false;
}
</script>

<template>
  <VueDragResize
    @mousedown="focus"
    v-click-outside="blur"
    :isResizeable="isFocused"
    :sticks="isFocused ? undefined : []"
    :z="z"
    v-bind="props"
  >
    <slot></slot>
  </VueDragResize>
</template>
