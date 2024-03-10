<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import { RifleType } from "./types";

const props = defineProps({
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
  <div class="flex-1 lg:pl-[300px] w-full lg:w-auto">
    <div class="flex flex-col items-center">
      <div
        v-if="!isWeaponCrafted"
        class="w-full lg:w-auto flex flex-col items-center"
      >
        <div
          class="relative w-full aspect-square lg:h-[476px] lg:w-[476px] max-w-[476px] max-h-[476px] mt-12 lg:mt-0"
        >
          <img
            :src="activeRifle.image"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
            :alt="activeRifle.name"
          />
          <svg
            class="w-[70%] h-[70%] lg:w-[304px] lg:h-[304px] max-w-[304px] max-h-[304px] -rotate-90 -scale-y-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
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
            class="w-[calc(70%-8px)] h-[calc(70%-8px)] lg:w-[288px] lg:h-[288px] max-w-[288px] max-h-[288px] bg-delicateWhiteVeil rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 overflow-hidden"
          ></div>
          <div
            class="w-[80%] h-[80%] lg:w-[372px] lg:h-[372px] max-w-[372px] max-h-[372px] bg-transparent border border-solid border-white/[0.35] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-[90%] h-[90%] lg:w-[422px] lg:h-[422px] max-w-[422px] max-h-[422px] bg-transparent border border-solid border-white/[0.15] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-full h-full lg:w-[476px] lg:h-[476px] max-w-[476px] max-h-[476px] bg-transparent border border-solid border-white/[0.04] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
        </div>
        <div class="flex flex-col items-center mt-14">
          <p class="text-white/50 text-xl mb-2.5">Time remaining</p>
          <span class="text-white text-3xl font-bold">00:35</span>
        </div>
      </div>
      <div
        v-else
        class="w-full lg:w-auto flex flex-col items-center"
      >
        <div
          class="relative w-full aspect-square lg:h-[476px] lg:w-[476px] max-w-[476px] max-h-[476px]"
        >
          <img
            :src="activeRifle.image"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            :alt="activeRifle.name"
          />
          <div
            class="w-[70%] h-[70%] lg:w-[293px] lg:h-[293px] max-w-[293px] max-h-[293px] bg-sublimeCitrusHaze border border-solid border-[rgba(185,240,69,0.25)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-[80%] h-[80%] lg:w-[372px] lg:h-[372px] max-w-[372px] max-h-[372px] bg-transparent border border-solid border-limeZest rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-[90%] h-[90%] lg:w-[422px] lg:h-[422px] max-w-[422px] max-h-[422px] bg-transparent border border-solid border-[rgba(185,240,69,0.20)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-full h-full lg:w-[476px] lg:h-[476px] max-w-[476px] max-h-[476px] bg-transparent border border-solid border-[rgba(185,240,69,0.04)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
        </div>
        <div class="flex flex-col items-center mt-14 w-full lg:w-[476px] max-w-[476px]">
          <h2 class="font-semibold text-center text-3xl text-white mb-5">
            Your weapon crafted
            <br />
            succesfully
          </h2>
          <div class="grid w-full grid-cols-1 sm:grid-cols-2 mt-2.5 gap-2.5 px-6">
            <button
              class="py-4 flex w-full justify-center items-center bg-primaryGreen text-white text-base font-bold"
            >
              Drop to inventory
            </button>
            <button
              class="py-4 flex justify-center items-center bg-transparent border border-solid border-white/50 text-white text-base font-bold"
            >
              Craft again
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center mt-20">
        <button
          class="uppercase text-base font-bold text-white py-3 px-2.5 border border-solid border-white/10"
        >
          LMB
        </button>
        <span class="text-base text-white ml-3">To rotate Weapon</span>
      </div>
    </div>
  </div>
</template>
