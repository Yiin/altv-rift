<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import { type RifleType } from "./types";

defineProps({
  activeRifle: {
    type: Object as () => RifleType,
    default: {} as RifleType,
  },
});

const isWeaponCrafted = ref(true);

const svg = ref<SVGElement | null>(null);
const dynamicR = ref(0);
const dynamicCx = ref(0);
const dynamicCy = ref(0);
const totalDashArray = ref(0);
const dashOffset = ref(0);

const calculateDynamicValues = () => {
  if (!svg.value) return;
  const svgWidth = svg.value.getBoundingClientRect().width;
  dynamicR.value = svgWidth / 2 - 4; // Adjusted for stroke-width of 8px
  dynamicCx.value = svgWidth / 2;
  dynamicCy.value = svgWidth / 2;

  const dropShadowGlow = svg.value.querySelector(".drop-shadow-glow") as SVGGeometryElement | null;
  setTimeout(() => {
    if (dropShadowGlow) {
      totalDashArray.value = dropShadowGlow.getTotalLength();
      const craftingProgressPercentage = 15;
      dashOffset.value =
        totalDashArray.value - (craftingProgressPercentage / 100) * totalDashArray.value;
    }
  });
};

onMounted(() => {
  calculateDynamicValues();
  window.addEventListener("resize", calculateDynamicValues);
});
</script>

<template>
  <div class="w-full flex-1 lg:w-auto lg:pl-[300px]">
    <div class="flex flex-col items-center">
      <div
        v-if="!isWeaponCrafted"
        class="flex w-full flex-col items-center lg:w-auto"
      >
        <div
          class="relative mt-12 aspect-square max-h-[476px] w-full max-w-[476px] lg:mt-0 lg:h-[476px] lg:w-[476px]"
        >
          <img
            :src="activeRifle.image"
            class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
            :alt="activeRifle.name"
          />
          <svg
            class="absolute left-1/2 top-1/2 -z-10 h-[70%] max-h-[304px] w-[70%] max-w-[304px] -translate-x-1/2 -translate-y-1/2 -rotate-90 -scale-y-100 lg:h-[304px] lg:w-[304px]"
            ref="svg"
          >
            <circle
              class="text-white/20"
              stroke-width="8"
              stroke="currentColor"
              fill="transparent"
              :r="dynamicR"
              :cx="dynamicCx"
              :cy="dynamicCy"
            />
            <circle
              class="text-mustardYellow drop-shadow-glow"
              stroke-width="8"
              :stroke-dasharray="totalDashArray"
              :stroke-dashoffset="dashOffset"
              stroke-linecap="butt"
              stroke="currentColor"
              fill="transparent"
              :r="dynamicR"
              :cx="dynamicCx"
              :cy="dynamicCy"
            />
          </svg>
          <div
            class="absolute left-1/2 top-1/2 -z-10 h-[calc(70%-8px)] max-h-[288px] w-[calc(70%-8px)] max-w-[288px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-delicateWhiteVeil lg:h-[288px] lg:w-[288px]"
          ></div>
          <div
            class="absolute left-1/2 top-1/2 -z-10 h-[80%] max-h-[372px] w-[80%] max-w-[372px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid border-white/[0.35] bg-transparent lg:h-[372px] lg:w-[372px]"
          ></div>
          <div
            class="absolute left-1/2 top-1/2 -z-10 h-[90%] max-h-[422px] w-[90%] max-w-[422px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid border-white/[0.15] bg-transparent lg:h-[422px] lg:w-[422px]"
          ></div>
          <div
            class="absolute left-1/2 top-1/2 -z-10 h-full max-h-[476px] w-full max-w-[476px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid border-white/[0.04] bg-transparent lg:h-[476px] lg:w-[476px]"
          ></div>
        </div>
        <div class="mt-14 flex flex-col items-center">
          <p class="mb-2.5 text-xl text-white/50">Time remaining</p>
          <span class="text-3xl font-bold text-white">00:35</span>
        </div>
      </div>
      <div
        v-else
        class="flex w-full flex-col items-center lg:w-auto"
      >
        <div
          class="relative aspect-square max-h-[476px] w-full max-w-[476px] lg:h-[476px] lg:w-[476px]"
        >
          <img
            :src="activeRifle.image"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            :alt="activeRifle.name"
          />
          <div
            class="absolute left-1/2 top-1/2 -z-10 h-[70%] max-h-[293px] w-[70%] max-w-[293px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid border-[rgba(185,240,69,0.25)] bg-sublimeCitrusHaze lg:h-[293px] lg:w-[293px]"
          ></div>
          <div
            class="absolute left-1/2 top-1/2 -z-10 h-[80%] max-h-[372px] w-[80%] max-w-[372px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid border-limeZest bg-transparent lg:h-[372px] lg:w-[372px]"
          ></div>
          <div
            class="absolute left-1/2 top-1/2 -z-10 h-[90%] max-h-[422px] w-[90%] max-w-[422px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid border-[rgba(185,240,69,0.20)] bg-transparent lg:h-[422px] lg:w-[422px]"
          ></div>
          <div
            class="absolute left-1/2 top-1/2 -z-10 h-full max-h-[476px] w-full max-w-[476px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid border-[rgba(185,240,69,0.04)] bg-transparent lg:h-[476px] lg:w-[476px]"
          ></div>
        </div>
        <div class="mt-14 flex w-full max-w-[476px] flex-col items-center lg:w-[476px]">
          <h2 class="mb-5 text-center text-3xl font-semibold text-white">
            Your weapon crafted
            <br />
            succesfully
          </h2>
          <div class="mt-2.5 grid w-full grid-cols-1 gap-2.5 px-6 sm:grid-cols-2">
            <button
              class="flex w-full items-center justify-center bg-primaryGreen py-4 text-base font-bold text-white"
            >
              Drop to inventory
            </button>
            <button
              class="flex items-center justify-center border border-solid border-white/50 bg-transparent py-4 text-base font-bold text-white"
            >
              Craft again
            </button>
          </div>
        </div>
      </div>
      <div class="mt-20 flex items-center justify-center">
        <button
          class="border border-solid border-white/10 px-2.5 py-3 text-base font-bold uppercase text-white"
        >
          LMB
        </button>
        <span class="ml-3 text-base text-white">To rotate Weapon</span>
      </div>
    </div>
  </div>
</template>
