<script setup lang="ts">
import { computed, onUnmounted, watch, ref } from "vue";
import { WebviewEvents } from "@shared/events/webview";
import { useAlt } from "@/composables/use-alt";

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

onUnmounted(() => {
  isMounted.value = false;
});

// Calculate the current rotation angle based on elapsed time
const calculateCurrentRotation = () => {
  const elapsedTime = Date.now() - props.startedAt;
  const normalizedTime = (elapsedTime % props.durationMs) / props.durationMs;
  return normalizedTime * 360; // Convert to degrees (0-360)
};

alt.on(WebviewEvents.FromClient.REGISTER_FISHING_CLICK, () => {
  // Capture the current rotation angle when stopping
  frozenRotation.value = calculateCurrentRotation();
  isAnimationStopped.value = true;
});

watch(
  () => props.startedAt,
  () => {
    isAnimationStopped.value = false;
    frozenRotation.value = 0;
  },
);

const circumference = Math.PI * 450;
const yellowLength = Math.PI * props.targetSize * 500;

const dashOffset = computed(
  () => circumference - props.targetPosition * circumference + yellowLength / 2,
);

// Computed style for the line element
const lineStyle = computed(() => {
  const baseStyle = {
    "--duration-ms": `${props.durationMs}ms`,
    "--delay-ms": `-${Date.now() - props.startedAt}ms`,
  };

  // Add transform property when animation is stopped
  if (isAnimationStopped.value) {
    return {
      ...baseStyle,
      transform: `rotate(${frozenRotation.value}deg)`,
    };
  }

  return baseStyle;
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
          :class="['target-line', { 'animate-rotation': !isAnimationStopped }]"
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

.animate-rotation {
  animation: rotate var(--duration-ms) linear;
  animation-delay: var(--delay-ms);
  animation-iteration-count: infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
