<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import { ref } from 'vue';

const props = defineProps<{
  startedAt: number;
  durationMs: number;
  targetPosition: number; // 0-1
  targetSize: number; // 0-1
}>();

const currentTime = ref(Date.now());

const isMounted = ref(true);

onUnmounted(() => {
  isMounted.value = false;
});

const circumference = Math.PI * 90;
const yellowLength = Math.PI * props.targetSize * 100;

const target = computed(() => ((currentTime.value - props.startedAt) / props.durationMs));

const dashOffset = computed(() => circumference - props.targetPosition * circumference + yellowLength / 2);
const targetAngle = computed(() => target.value * 360);

requestAnimationFrame(function update() {
  currentTime.value = Math.min(Date.now(), props.startedAt + props.durationMs);

  if (isMounted.value) {
    requestAnimationFrame(update);
  }
});
</script>

<template>
  <div class="absolute w-full h-full flex items-center justify-center">
    <svg width="233" height="233" viewBox="-5 -5 110 110">
      <circle cx="50" cy="50" r="47.25" fill="none" stroke="#ffffff33" stroke-width="1" />
      <circle cx="50" cy="50" r="42.75" fill="none" stroke="#ffffff33" stroke-width="1" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff26" stroke-width="3.5" />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#FFDA57"
        stroke-width="5.5"
        :stroke-dasharray="yellowLength + ' ' + (circumference - yellowLength)"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 50 50)" />
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="10"
        stroke="#fff"
        stroke-width="4"
        stroke-linecap="round"
        :transform="`rotate(${targetAngle} 50 50)`" />
    </svg>
  </div>
</template>
