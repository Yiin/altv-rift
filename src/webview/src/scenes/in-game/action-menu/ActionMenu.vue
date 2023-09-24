<script setup lang="ts">
import { useEventListener } from "@/composables/use-event-listener";
import { useClient } from "@/store/synced/client.store";
import { ClientEvents } from "@shared/events/client";
import { ActionItem } from "@shared/store/client.store";
import { ref, computed, watch } from "vue";

type Slice = ActionItem & {
  empty: boolean;
  d: string;
  centroid: { x: number; y: number };
  labelX: number;
  labelY: number;
};

const radius = 200;

const client = useClient();

const slices = computed(() => {
  const items = [...client.actionMenu] as Slice[];

  const sliceCount = Math.max(items.length, 3);
  const anglePerSlice = 360 / sliceCount;

  // If there are less than tree items, append { empty: true } items until there are 3 items:
  return items
    .concat(Array.from({ length: 3 - items.length }, () => ({ empty: true })) as Slice[])
    .map((slice, index) => {
      const startAngle = anglePerSlice * (index - 1);
      const endAngle = anglePerSlice * index;

      // Calculate label positions
      const labelAngle = (startAngle + endAngle) / 2;
      const radian = (labelAngle * Math.PI) / 180;

      // Calculate the centroid of the slice using the midpoint angle
      const centroidX = 250 + radius * 0.5 * Math.cos(radian); // Adjust the 0.5 factor as needed
      const centroidY = 250 + radius * 0.5 * Math.sin(radian); // Adjust the 0.5 factor as needed

      return {
        ...slice,
        centroid: { x: centroidX, y: centroidY },
        // Generate the SVG path (d attribute) for this slice
        d: describeArc(250, 250, radius, startAngle, endAngle),
        labelX: 250 + (radius / 2 + 10) * Math.cos(radian),
        labelY: 250 + (radius / 2 + 10) * Math.sin(radian),
      };
    });
});

// Create SVG path data and label positions for each slice
const sliceCount = Math.max(slices.value.length, 3);
const anglePerSlice = 360 / sliceCount;

const svg = ref<HTMLElement>();
const hoveredSliceIndex = ref(0);

const currentSlice = computed(() => slices.value[hoveredSliceIndex.value]);

watch(
  () => currentSlice.value,
  (slice) => {
    if (!slice.empty) {
      alt.emit(ClientEvents.FromWebview.PLAY_SOUND, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET");
    }
  }
);

useEventListener("mousemove", handleMouseMove);

function handleMouseMove(event: MouseEvent) {
  if (!svg.value) {
    return;
  }

  // Get the cursor's x and y coordinates relative to the SVG element
  const rect = svg.value.getBoundingClientRect();
  const x = event.clientX - rect.left - 250; // 250 is the circle's centerX
  const y = event.clientY - rect.top - 250; // 250 is the circle's centerY

  // Calculate the angle
  const angle = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

  // Determine which slice is hovered
  const index = Math.floor(angle / anglePerSlice);
  hoveredSliceIndex.value = (index + 1) % sliceCount;
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  // Convert angles to radians
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "L",
    start.x,
    start.y,
  ].join(" ");
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function select() {
  alt.emit(ClientEvents.FromWebview.ACTION_MENU_SELECT, currentSlice.value.title);
}
</script>

<template>
  <div class="flex items-center justify-center h-screen cursor-pointer" @mousedown="select">
    <svg ref="svg" width="500" height="500" class="-ml-[4.55%]">
      <!-- Define the pattern -->
      <defs>
        <pattern id="bg-pattern" patternUnits="userSpaceOnUse" width="500" height="500">
          <image v-if="!currentSlice.empty" :href="`./assets/actions/${currentSlice.type}.png`"
            :x="currentSlice.centroid.x - 150" :y="currentSlice.centroid.y - 175" width="350" height="350" opacity="0.7"
            class="brightness-[0.8]" preserve-aspect-ratio="true" />
        </pattern>
      </defs>

      <!-- Create slices dynamically -->
      <path v-for="(slice, index) in slices" :key="index" :d="slice.d"
        :fill="!slice.empty && hoveredSliceIndex === index ? 'url(#bg-pattern)' : 'rgba(0,0,0,0.3)'"
        class="transition-transform origin-[250px_250px]"
        :class="{ 'scale-105': !slice.empty && hoveredSliceIndex === index }" />
      <!-- Add text labels -->
      <template v-for="(slice, index) in slices.filter((slice) => !slice.empty)" :key="index">
        <text :x="slice.labelX" :y="slice.labelY" text-anchor="middle"
          class="pointer-events-none fill-white uppercase font-bold tracking-widest text-lg">
          {{ slice.title }}
        </text>
        <text v-if="slice.subtitle" :x="slice.labelX" :y="slice.labelY + 20" text-anchor="middle"
          class="pointer-events-none fill-white uppercase font-semibold tracking-wider text-sm">
          {{ slice.subtitle }}
        </text>
      </template>
    </svg>
  </div>
</template>

<style scoped>
.game-bg {
  background-image: url(https://cdn.discordapp.com/attachments/940539225856684042/1139882621187407972/image.png);
  background-size: cover;
  background-position: 20%;
}
</style>
