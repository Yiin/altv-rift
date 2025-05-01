<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  timeRemaining: number;
  totalTime: number;
  showProgressBar?: boolean;
  size?: "small" | "large";
}>();

// Defaults
const showProgressBar = computed(() => props.showProgressBar ?? false);
const size = computed(() => props.size ?? "small");

// Calculate time percentage remaining
const timePercentage = computed(() => {
  return (props.timeRemaining / props.totalTime) * 100;
});

// Get color class based on remaining time percentage
const colorClass = computed(() => {
  const percentage = timePercentage.value / 100;

  if (percentage > 0.66) return "text-green-500";
  if (percentage > 0.33) return "text-yellow-500";
  return "text-red-500";
});

// Format time as MM:SS
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
</script>

<template>
  <div>
    <span
      class="font-mono font-bold"
      :class="[colorClass, { 'text-lg': size === 'small', 'text-4xl': size === 'large' }]"
    >
      {{ formatTime(timeRemaining) }}
    </span>

    <!-- Progress bar (optional) -->
    <div
      v-if="showProgressBar"
      class="mt-3 h-3 overflow-hidden rounded-full bg-neutral-800"
    >
      <div
        class="h-full transition-all duration-200"
        :class="colorClass"
        :style="{ width: `${timePercentage}%` }"
      ></div>
    </div>
  </div>
</template>
