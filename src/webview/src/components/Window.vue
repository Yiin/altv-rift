<script setup lang="ts">
import { onMounted, ref } from "vue";
import { vClickOutside } from "../directives/click-outside";
import { useWindows } from "../store/windows.store";
import DragResize from "./DragResize.vue";

const props = withDefaults(
  defineProps<{
    wrapper?: boolean;
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
    w?: number | "auto";
    h?: number | "auto";
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
    wrapper: false,
  }
);

const windows = useWindows();

const z = ref(windows.topIndex++);
const isFocused = ref();

function focus(e: MouseEvent) {
  if (!props.isActive) return;
  isFocused.value = true;
  z.value = windows.topIndex++;
}

function blur() {
  isFocused.value = false;
}
</script>

<template>
  <DragResize
    v-if="!wrapper"
    @mousedown="focus"
    v-click-outside="blur"
    :isResizeable="isFocused"
    :sticks="isFocused ? undefined : []"
    :z="z"
    class="outline-none"
    v-bind="props"
  >
    <slot></slot>
  </DragResize>
  <div v-else class="relative" :style="{ zIndex: z }">
    <slot />
  </div>
</template>
