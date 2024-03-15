<template>
  <div
    class="donut-chart h-28 w-28 before:bottom-1 before:left-1 before:right-1 before:top-1"
    :style="{ '--percent': percent + '%' }"
  >
    <div class="center-text">
      <div class="text-center text-sm font-bold uppercase text-white">{{ label }}</div>
      <div class="text-center text-sm font-bold uppercase text-sunriseYellow">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    percent: number;
    label: string;
    value: string;
  }>(),
  {
    label: "",
    value: "",
  },
);
</script>

<style scoped>
.donut-chart {
  position: relative;
  border-radius: 50%;
  background: conic-gradient(
    #ffda57 0% var(--percent),
    rgba(255, 255, 255, 0.1) var(--percent) 100%
  );
}

.donut-chart::before {
  content: "";
  position: absolute;
  border-radius: 50%;
  background-color: black;
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
