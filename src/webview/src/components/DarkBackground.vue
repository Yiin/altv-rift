<script setup lang="ts">
import { useWindowSize } from "@/composables/use-window-size";

withDefaults(
  defineProps<{
    bgClass?: string;
  }>(),
  {
    bgClass: "bg-darkRadialGradient",
  },
);

const windowSize = useWindowSize();
</script>

<template>
  <div class="fixed inset-0 -z-10">
    <div
      class="absolute inset-0 left-0 top-0 opacity-95"
      :class="[bgClass]"
    ></div>
    <svg
      class="absolute inset-0 left-0 top-0"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:svgjs="http://svgjs.dev/svgjs"
      :viewBox="`0 0 ${windowSize.width} ${windowSize.height}`"
      :width="windowSize.width"
      :height="windowSize.height"
      opacity="0.3"
    >
      <defs>
        <filter
          id="nnnoise-filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          color-interpolation-filters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.2"
            numOctaves="4"
            seed="15"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          ></feTurbulence>
          <feSpecularLighting
            surfaceScale="18"
            specularConstant="0.2"
            specularExponent="20"
            lighting-color="#ffffff"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="turbulence"
            result="specularLighting"
          >
            <feDistantLight
              azimuth="3"
              elevation="16"
            ></feDistantLight>
          </feSpecularLighting>
        </filter>
      </defs>
      <rect
        :width="windowSize.width"
        :height="windowSize.height"
        fill="#00000000"
      ></rect>
      <rect
        :width="windowSize.width"
        :height="windowSize.height"
        fill="#ffffff"
        filter="url(#nnnoise-filter)"
      ></rect>
    </svg>
  </div>
</template>
