<script setup lang="ts">
import { AvailableWeaponModuleType } from "./types";

const props = defineProps({
  availableModules: Array<AvailableWeaponModuleType>,
});

const activeAvailableModule = props.availableModules?.find((module) => module.isActive);
</script>

<template>
  <div class="max-w-xs flex flex-col items-end w-full">
    <h2 class="text-white text-3xl mb-9">Available Modules</h2>
    <button
      id="dropdownDefaultButton"
      data-dropdown-toggle="dropdown"
      class="text-white bg-transparent border border-solid border-white/10 font-bold rounded-md text-base px-5 py-4 text-center flex justify-between items-center mb-2.5 gap-6"
      type="button">
      <div class="flex gap-3 items-center">
        <p>Attachments</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="6"
        viewBox="0 0 8 6"
        fill="none">
        <path
          d="M0.5 1L4 4.5L7.5 1"
          stroke="white"
          stroke-linecap="round"></path>
      </svg>
    </button>
    <div class="w-full flex flex-col gap-1.5 mb-14">
      <div
        v-for="(module, index) in props.availableModules"
        class="bg-weaponCard border border-solid rounded-md px-5 py-4 flex justify-between items-center gap-4 w-full"
        :class="`${module.isActive ? 'border-white' : 'border-transparent'}`">
        <div>
          <p class="text-white text-base">{{ module.name }}</p>
          <span class="text-primaryGreen text-sm">Stage {{ module.stage }}</span>
        </div>
        <div class="w-20">
          <img
            :src="module.image"
            :alt="module.name"
            class="w-full" />
        </div>
      </div>
    </div>
    <div class="flex flex-col items-end">
      <div class="w-52 mb-4">
        <img
          :src="activeAvailableModule?.image"
          :alt="activeAvailableModule?.name"
          class="w-full" />
      </div>
      <p class="text-primaryGreen text-base font-semibold">Attachments</p>
      <p class="text-2xl text-white font-bold">{{ activeAvailableModule?.name }}</p>
      <p class="text-base font-semibold text-steelGray mb-4">
        {{ activeAvailableModule?.desc }}
      </p>
      <span class="text-2xl text-primaryGreen font-semibold mb-6">
        ${{ activeAvailableModule?.price }}
      </span>
      <div class="flex flex-col gap-3">
        <div
          v-for="extra in activeAvailableModule?.extras"
          class="flex items-center gap-2 mb-14">
          <div>
            <p class="text-base text-white uppercase">{{ extra.name }}</p>
            <p class="text-sm text-primaryGreen uppercase">{{ extra.desc }}</p>
          </div>
          <div
            class="relative bg-weaponCard border border-solid border-white/5 w-10 h-10 flex justify-center items-center">
            <img
              :src="extra.image"
              :alt="extra.name" />
            <span
              class="text-xs bg-primaryGreen text-white text-center rounded-sm px-0.5 font-bold absolute -top-1 -right-1">
              x{{ extra.x }}
            </span>
          </div>
        </div>
      </div>
      <button
        class="py-5 px-9 flex justify-center items-center bg-primaryGreen text-white text-base font-bold">
        Start crafting
      </button>
    </div>
  </div>
</template>
