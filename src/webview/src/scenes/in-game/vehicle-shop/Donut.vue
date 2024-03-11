<template>
  <div class="donut-chart w-28 h-28" :style="{ '--percent': percent + '%' }">
    <div class="center-text">
      <div class="text-sm text-white font-bold text-center uppercase">{{ label }}</div>
      <div class="text-sm text-sunriseYellow font-bold text-center uppercase">{{ value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
.donut-chart {
  position: relative;
  border-radius: 50%;
  background: conic-gradient(#FFDA57 0% var(--percent),
      rgba(255, 255, 255, 0.1) var(--percent) 100%);
}

.donut-chart::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
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
