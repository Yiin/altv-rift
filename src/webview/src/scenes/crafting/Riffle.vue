<script setup lang="ts">
import { defineProps, ref } from "vue";
import { RifleType } from "./types";

const props = defineProps({
  activeRifle: {
    type: Object as () => RifleType,
    default: {} as RifleType,
  },
});

const isWeaponCrafted = ref(true);
</script>

<template>
  <div class="flex-1">
    <div class="flex flex-col items-center">
      <div v-if="!isWeaponCrafted">
        <div class="relative h-[476px] w-[476px]">
          <img
            :src="activeRifle.image"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            :alt="activeRifle.name"
          />
          <svg
            class="w-[304px] h-[304px] -rotate-90 -scale-y-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          >
            <circle
              class="text-white/20"
              stroke-width="8"
              stroke="currentColor"
              fill="transparent"
              r="147"
              cx="152"
              cy="152"
            />
            <circle
              class="text-mustardYellow drop-shadow-glow"
              stroke-width="8"
              :stroke-dasharray="955.04"
              :stroke-dashoffset="955.04 - (15 / 100) * 955.04"
              stroke-linecap="butt"
              stroke="currentColor"
              fill="transparent"
              r="147"
              cx="152"
              cy="152"
            />
          </svg>
          <div
            class="w-72 h-72 bg-delicateWhiteVeil rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 overflow-hidden"
          ></div>
          <div
            class="w-[372px] h-[372px] bg-transparent border border-solid border-white/35 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-[422px] h-[422px] bg-transparent border border-solid border-white/15 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-[476px] h-[476px] bg-transparent border border-solid border-white/[0.04] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
        </div>
        <div class="flex flex-col items-center mt-14">
          <p class="text-white/50 text-xl mb-2.5">Time remaining</p>
          <span class="text-white text-3xl font-bold">00:35</span>
        </div>
      </div>
      <div v-else>
        <div class="relative h-[476px] w-[476px]">
          <img
            :src="activeRifle.image"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            :alt="activeRifle.name"
          />
          <div
            class="w-72 h-72 bg-sublimeCitrusHaze border border-solid border-[rgba(185,240,69,0.25)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-[372px] h-[372px] bg-transparent border border-solid border-limeZest rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-[422px] h-[422px] bg-transparent border border-solid border-[rgba(185,240,69,0.20)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
          <div
            class="w-[476px] h-[476px] bg-transparent border border-solid border-[rgba(185,240,69,0.04)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
          ></div>
        </div>
        <div class="flex flex-col items-center mt-14 w-[476px]">
          <h2 class="font-semibold text-center text-3xl text-white mb-5">
            Your weapon crafted
            <br />
            succesfully
          </h2>
          <div class="grid w-full grid-cols-2 mt-2.5 gap-2.5 px-6">
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
