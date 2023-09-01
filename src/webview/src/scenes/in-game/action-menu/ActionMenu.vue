<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import Screen from "@/components/Screen.vue";

const items = computed(() => {
  return [
    {
      label: "Start fishing",
      icon: "mdi-fish",
    },
    {
      label: "Start fishing",
      icon: "mdi-fish",
    },
    {
      label: "Start fishing",
      icon: "mdi-fish",
    },
  ];
});
const center = { x: 250, y: 250 }; // Assuming the wheel has a size of 300x300
const cursor = ref({ x: 0, y: 0 });
const wheelNode = ref<HTMLDivElement>();

const totalItems = computed(() => {
  return Math.max(items.value.length, 3);
});

const angleStep = computed(() => {
  const angleStep = 360 / totalItems.value;

  return angleStep;
});

const hoveredIndex = ref(null);

const checkHover = () => {
  if (!wheelNode.value) return;

  const dx = cursor.value.x - center.x;
  const dy = cursor.value.y - center.y;

  const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90 + angleStep.value / 2;
  const normalizedAngleDeg = angleDeg < 0 ? angleDeg + 360 : angleDeg;

  const radius = 250; // The radius of the wheel
  const distance = Math.sqrt(dx * dx + dy * dy);

  const hoverIndex = Math.floor(normalizedAngleDeg / angleStep.value);
  hoveredIndex.value = hoverIndex;
};

watchEffect(() => {
  checkHover();
});

const getPath = (index) => {
  const rotation = (index / totalItems.value) * 360;
  const radius = 250; // Assuming the wheel has a radius of 150

  const x1 = radius + radius * Math.sin((rotation * Math.PI) / 180);
  const y1 = radius - radius * Math.cos((rotation * Math.PI) / 180);

  const x2 = radius + radius * Math.sin(((rotation + angleStep.value) * Math.PI) / 180);
  const y2 = radius - radius * Math.cos(((rotation + angleStep.value) * Math.PI) / 180);

  // M = move to, L = line to, A = arc, Z = close path
  return `M ${radius}, ${radius} L ${x1}, ${y1} A ${radius} ${radius} 0 0 1 ${x2}, ${y2} Z`;
};

const updateLine = (event) => {
  if (!wheelNode.value) {
    return;
  }

  const rect = wheelNode.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;

  // Normalize the vector from the center to the cursor
  const distance = Math.sqrt(dx * dx + dy * dy);
  const radius = (rect.width / 2) * 1.05;

  // Make sure the line is not longer than the radius
  const lineLength = Math.min(distance, radius);

  // Normalize the vector and scale it to the lineLength
  const normalizedX = (dx / distance) * lineLength;
  const normalizedY = (dy / distance) * lineLength;

  // Make sure coordinates are relative to the wheel's center
  cursor.value.x = normalizedX + center.x;
  cursor.value.y = normalizedY + center.y;
};

function rotateBg(index) {
  let angle = angleStep.value / 2;

  for (let i = 0; i < index; ++i) {
    angle += angleStep.value;
  }

  return 360 - angle;
}

function generateLowPolyArcPoints(
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  numLines,
  rotationAngle
) {
  let points = `${centerX}px ${centerY}px,`; // Start from the center

  // Convert angles to radians
  const startAngleRad = (Math.PI / 180) * startAngle;
  const endAngleRad = (Math.PI / 180) * endAngle;
  const rotationAngleRad = (Math.PI / 180) * rotationAngle;

  // Calculate the angle step size for each line
  const angleStep = (endAngleRad - startAngleRad) / (numLines - 1);

  for (let i = 0; i < numLines; i++) {
    // Calculate the angle for this line
    const angle = startAngleRad + i * angleStep;

    // Calculate the x and y coordinates for this point
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);

    // Rotate the point around the center
    const xRotated =
      centerX +
      (x - centerX) * Math.cos(rotationAngleRad) -
      (y - centerY) * Math.sin(rotationAngleRad);
    const yRotated =
      centerY +
      (x - centerX) * Math.sin(rotationAngleRad) +
      (y - centerY) * Math.cos(rotationAngleRad);

    // Add this point to our list of points
    points += `${xRotated}px ${yRotated}px,`;
  }

  // Return to the center to close the shape
  points += `${centerX}px ${centerY}px`;

  return `polygon(${points})`;
}

function generateClipPathForItem(index) {
  // Radius of the slice
  const radius = 260;

  // Common parameters
  const numLines = 5;
  const arcStartAngle = -30;
  const arcEndAngle = 90;

  // Calculate rotation angle based on index and total items
  const rotationAngle = (360 * index) / totalItems.value + angleStep.value / 2 + 180;

  // Convert the rotation angle to radians for trigonometry
  const rotationAngleRad = (Math.PI / 180) * rotationAngle;

  // Calculate the center of the slice in Cartesian coordinates
  const centerX = center.x + half * Math.cos(rotationAngleRad);
  const centerY = center.y + half * Math.sin(rotationAngleRad);

  // Generate clip path
  return generateLowPolyArcPoints(
    centerX,
    centerY,
    radius,
    arcStartAngle,
    arcEndAngle,
    numLines,
    rotationAngle
  );
}
</script>

<template>
  <div class="w-full h-full flex items-center justify-center" @mousemove="updateLine">
    <svg class="relative w-full h-[500px] -translate-y-1/2" ref="wheelNode" viewBox="0 0 500 500">
      <g
        v-for="(item, index) in items"
        :key="index"
        :style="{
          transform: `rotate(${angleStep * index}deg)`,
          scale: index === hoveredIndex ? 1.05 : 1,
        }"
      >
        <!-- Background -->
        <path
          :d="getPath(index)"
          :class="{
            'triangle-path': index !== hoveredIndex,
            'triangle-path-hover': index === hoveredIndex,
          }"
        />
        <!-- Text and Icon -->
        <text
          :x="center.x"
          :y="center.y - 50"
          :style="{
            transform: `rotate(-${angleStep * index}deg)`,
          }"
          class="text-white text-2xl"
        >
          {{ item.label }}
        </text>
        <!-- Your icon can be added here as an SVG -->
      </g>
      <!-- Line from center to cursor -->
      <line
        :x1="center.x"
        :y1="center.y"
        :x2="cursor.x"
        :y2="cursor.y"
        class="stroke-yellow-400 stroke-1"
      />
    </svg>
  </div>
</template>

<style scoped>
.triangle-path {
  fill: rgba(0, 0, 0, 0.1);
}

.triangle-path-hover {
  fill: rgba(0, 0, 0, 0.7);
}
</style>
