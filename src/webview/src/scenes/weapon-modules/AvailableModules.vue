<script setup lang="ts">
import { defineProps } from "vue";
import PipeBrushed from "../../../public/assets/items/pipe-brushed.png";
import Suppressor from "../../../public/assets/items/suppressor.png";
import { WeaponModuleType } from "./types";

const props = defineProps({
  availableModules: {
    type: Object as () => WeaponModuleType,
    default: {} as WeaponModuleType,
  },
});
</script>

<template>
  <div class="max-w-sm flex flex-col items-end w-full">
    <h2 class="text-white text-3xl">Available Modules</h2>
    <button
      id="dropdownDefaultButton"
      data-dropdown-toggle="dropdown"
      class="text-white bg-transparent border border-solid border-white/10 font-bold rounded-md text-base px-5 py-4 text-center flex justify-between items-center mb-2.5 gap-6"
      type="button"
    >
      <div class="flex gap-3 items-center">
        <p>Attachments</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="6"
        viewBox="0 0 8 6"
        fill="none"
      >
        <path
          d="M0.5 1L4 4.5L7.5 1"
          stroke="white"
          stroke-linecap="round"
        ></path>
      </svg>
    </button>
    <div class="w-full flex flex-col gap-1.5">
      <div
        class="bg-weaponCard border border-solid border-white rounded-md px-5 py-4 flex justify-between items-center gap-4 w-full"
      >
        <div>
          <p class="text-white text-base">Suppressor</p>
          <span class="text-primaryGreen text-sm">Stage 2</span>
        </div>
        <div class="w-20">
          <img
            :src="Suppressor"
            alt="suppressor"
            class="w-full"
          />
        </div>
      </div>
      <div
        class="bg-weaponCard rounded-md px-5 py-4 flex justify-between items-center gap-4 w-full"
      >
        <div>
          <p class="text-white text-base">Suppressor</p>
          <span class="text-primaryGreen text-sm">Stage 2</span>
        </div>
        <div class="w-20">
          <img
            :src="Suppressor"
            alt="suppressor"
            class="w-full"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col items-end">
      <div>
        <img
          :src="Suppressor"
          alt="suppressor"
        />
      </div>
      <p class="text-primaryGreen text-base font-semibold">Attachments</p>
      <p class="text-2xl text-white font-bold">Suppressor</p>
      <p class="text-base font-semibold text-steelGray">
        Silences but slightly reduces damage and range
      </p>
      <span class="text-2xl text-primaryGreen font-semibold">$12,450</span>
      <div class="flex items-center gap-2">
        <div>
          <p class="text-base text-white uppercase">Metal Pipes</p>
          <p class="text-sm text-primaryGreen uppercase">Required to craft</p>
        </div>
        <div
          class="relative bg-weaponCard border border-solid border-white/5 w-10 h-10 flex justify-center items-center"
        >
          <img
            :src="PipeBrushed"
            alt="pipe brushed"
          />
          <span
            class="text-xs bg-primaryGreen text-white text-center rounded-sm px-0.5 font-bold absolute -top-1 -right-1"
          >
            x12
          </span>
        </div>
      </div>
      <button
        class="py-5 px-9 flex justify-center items-center bg-primaryGreen text-white text-base font-bold"
      >
        Start crafting
      </button>
    </div>
  </div>
</template>
