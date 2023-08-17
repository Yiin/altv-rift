<script setup lang="ts">
import { effect, onMounted, ref } from "vue";
import { vClickOutside } from "../directives/click-outside";
import { useWindows } from "../store/windows.store";
import DragResize from "./DragResize.vue";
import { rpc } from "@/rpc";
import { ServerCall } from "@shared/calls/server";

const props = withDefaults(
  defineProps<{
    name?: string;
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
    sticks?: ("tl" | "tm" | "tr" | "mr" | "br" | "bm" | "bl" | "ml")[];
    axis?: "x" | "y" | "both" | "none";
    contentClass?: string;
    style?: any;
  }>(),
  {
    isActive: true,
    isDraggable: true,
    wrapper: false,
    sticks: () => ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml"],
    w: (props) => {
      return props.minw ?? 200;
    },
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

function stop(rect: { x: number; y: number; width: number; height: number }) {
  if (props.name) {
    rpc.callServer(ServerCall.FromWebview.MOVE_WINDOW,
      props.name,
      {
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height,
      }
    );
  }
}
</script>

<template>
  <DragResize v-if="!wrapper" @mousedown="focus" @dragstop="stop" v-click-outside="blur" :z="z" class="outline-none"
    v-bind="props" @move="" :isResizeable="isFocused" :sticks="isFocused ? sticks : []">
    <slot></slot>
  </DragResize>
  <div v-else class="relative" :style="{ zIndex: z }">
    <slot />
  </div>
</template>
