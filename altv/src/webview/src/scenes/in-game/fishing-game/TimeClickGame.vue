<script setup lang="ts">
import { computed, onUnmounted, watch, ref, onMounted } from "vue";
import { WebviewEvents } from "@shared/events/webview";
import { ServerCall } from "@shared/calls/server";
import { useAlt } from "@/composables/use-alt";
import { rpc } from "@/rpc";

const props = defineProps<{
  startedAt: number;
  durationMs: number;
  targetPosition: number; // 0-1
  targetSize: number; // 0-1
}>();

const alt = useAlt();
const isMounted = ref(true);
const isAnimationStopped = ref(false);
const frozenRotation = ref(0);
const actualVisualRotation = ref(0);
let animationFrameId = 0;

// Track the actual visual rotation with requestAnimationFrame
const trackVisualRotation = () => {
  const elapsedTime = Date.now() - props.startedAt;
  const normalizedTime = (elapsedTime % props.durationMs) / props.durationMs;
  actualVisualRotation.value = normalizedTime * 360; // Convert to degrees (0-360)

  if (isMounted.value && !isAnimationStopped.value) {
    animationFrameId = requestAnimationFrame(trackVisualRotation);
  }
};

alt.on(WebviewEvents.FromClient.REGISTER_FISHING_CLICK, handleClick);

onMounted(() => {
  animationFrameId = requestAnimationFrame(trackVisualRotation);
});

onUnmounted(() => {
  isMounted.value = false;
  cancelAnimationFrame(animationFrameId);
});

// Handle clicks directly in the component
function handleClick() {
  if (isAnimationStopped.value) return;

  // Stop the animation
  isAnimationStopped.value = true;
  cancelAnimationFrame(animationFrameId);

  // Use the ACTUAL visual rotation at click time
  frozenRotation.value = actualVisualRotation.value;

  // Notify the server about the click (with result)
  // This replaces the server-side REGISTER_FISHING_CLICK event
  rpc.callServer(ServerCall.FromWebview.FISHING_CLICK_RESULT, {
    rotation: frozenRotation.value,
    isSuccess: isClickSuccessful(frozenRotation.value),
  });
}

// Determine if the click was successful
const isClickSuccessful = (rotation: number) => {
  // Normalize rotation to 0-1 scale
  const normalizedRotation = (rotation / 360) % 1;

  // Calculate the target range
  const halfTargetSize = props.targetSize / 2;
  const targetStart = props.targetPosition - halfTargetSize;
  const targetEnd = props.targetPosition + halfTargetSize;

  // Account for wrapping around 0/1
  if (targetStart < 0) {
    return normalizedRotation > 1 + targetStart || normalizedRotation < targetEnd;
  } else if (targetEnd > 1) {
    return normalizedRotation > targetStart || normalizedRotation < targetEnd - 1;
  } else {
    return normalizedRotation > targetStart && normalizedRotation < targetEnd;
  }
};

watch(
  () => props.startedAt,
  () => {
    isAnimationStopped.value = false;
    frozenRotation.value = 0;
    if (isMounted.value) {
      animationFrameId = requestAnimationFrame(trackVisualRotation);
    }
  },
);

const circumference = Math.PI * 450;
const yellowLength = Math.PI * props.targetSize * 500;

const dashOffset = computed(
  () => circumference - props.targetPosition * circumference + yellowLength / 2,
);

// Use the tracked visual rotation directly instead of relying on CSS animation
const lineStyle = computed(() => {
  if (isAnimationStopped.value) {
    return {
      transform: `rotate(${frozenRotation.value}deg)`,
    };
  }

  return {
    transform: `rotate(${actualVisualRotation.value}deg)`,
  };
});
</script>

<template>
  <div class="absolute flex h-full w-full items-center justify-center">
    <div class="relative">
      <svg
        class="h-80 w-80"
        viewBox="-25 -25 550 550"
      >
        <circle
          cx="250"
          cy="250"
          r="227.25"
          fill="none"
          stroke="#ffffff33"
          stroke-width="1"
        />
        <circle
          cx="250"
          cy="250"
          r="222.75"
          fill="none"
          stroke="#ffffff33"
          stroke-width="1"
        />
        <circle
          cx="250"
          cy="250"
          r="225"
          fill="none"
          stroke="#ffffff26"
          stroke-width="3.5"
        />
        <circle
          class="stroke-blue-500"
          cx="250"
          cy="250"
          r="225"
          fill="none"
          stroke-width="10"
          :stroke-dasharray="yellowLength + ' ' + (circumference - yellowLength)"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 250 250)"
        />
        <line
          x1="250"
          y1="0"
          x2="250"
          y2="50"
          stroke="#fff"
          stroke-width="15"
          stroke-linecap="round"
          class="target-line"
          :style="lineStyle"
        />
      </svg>
      <div class="absolute left-0 top-0 flex h-full w-full flex-col justify-center">
        <div class="text-center text-2xl font-semibold uppercase text-white">
          you caught a fish!
        </div>
        <div class="text-md text-center uppercase text-white">click on time</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.target-line {
  transform-origin: 250px 250px;
}
</style>
