<script setup lang="ts">
import { computed, onUnmounted } from "vue";
import { ref } from "vue";

const props = defineProps<{
  startedAt: number;
  durationMs: number;
  targetPosition: number; // 0-1
  targetSize: number; // 0-1
}>();

const currentTime = ref(Date.now());

const isMounted = ref(true);
const isFailed = ref(false);

onUnmounted(() => {
  isMounted.value = false;
});

const circumference = Math.PI * 450;
const yellowLength = Math.PI * props.targetSize * 500;

const target = computed(() => (currentTime.value - props.startedAt) / props.durationMs);

const dashOffset = computed(
  () => circumference - props.targetPosition * circumference + yellowLength / 2,
);
const targetAngle = computed(() => target.value * 360);

requestAnimationFrame(function update() {
  currentTime.value = Math.min(Date.now(), props.startedAt + props.durationMs);

  if (currentTime.value === props.startedAt + props.durationMs) {
    isFailed.value = true;
  }

  if (isMounted.value) {
    requestAnimationFrame(update);
  }
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
          :stroke="isFailed ? '#800' : '#fff'"
          stroke-width="15"
          stroke-linecap="round"
          :transform="`rotate(${targetAngle} 250 250)`"
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
