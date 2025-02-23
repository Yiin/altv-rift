<script setup lang="ts">
import Image from "@/components/Image.vue";
import { type AvailableWeaponModuleType } from "./types";

const props = defineProps({
  availableModules: Array<AvailableWeaponModuleType>,
});

const activeAvailableModule = props.availableModules?.find((module) => module.isActive);
</script>

<template>
  <div class="flex w-full max-w-xs flex-col items-end">
    <h2 class="mb-9 text-3xl text-white">Available Modules</h2>
    <button
      id="dropdownDefaultButton"
      data-dropdown-toggle="dropdown"
      class="mb-2.5 flex items-center justify-between gap-6 rounded-md border border-solid border-white/10 bg-transparent px-5 py-4 text-center text-base font-bold text-white"
      type="button"
    >
      <div class="flex items-center gap-3">
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
    <div class="mb-14 flex w-full flex-col gap-1.5">
      <div
        v-for="module in props.availableModules"
        :key="module.name"
        class="flex w-full items-center justify-between gap-4 rounded-md border border-solid bg-weaponCard px-5 py-4"
        :class="`${module.isActive ? 'border-white' : 'border-transparent'}`"
      >
        <div>
          <p class="text-base text-white">{{ module.name }}</p>
          <span class="text-sm text-primaryGreen">Stage {{ module.stage }}</span>
        </div>
        <div class="w-20">
          <Image
            :src="module.image"
            :alt="module.name"
            class="w-full"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col items-end">
      <div class="mb-4 w-52">
        <Image
          v-if="activeAvailableModule"
          :src="activeAvailableModule.image"
          :alt="activeAvailableModule.name"
          class="w-full"
        />
      </div>
      <p class="text-base font-semibold text-primaryGreen">Attachments</p>
      <p class="text-2xl font-bold text-white">{{ activeAvailableModule?.name }}</p>
      <p class="mb-4 text-base font-semibold text-steelGray">
        {{ activeAvailableModule?.desc }}
      </p>
      <span class="mb-6 text-2xl font-semibold text-primaryGreen">
        ${{ activeAvailableModule?.price }}
      </span>
      <div class="flex flex-col gap-3">
        <div
          v-for="extra in activeAvailableModule?.extras"
          :key="extra.name"
          class="mb-14 flex items-center gap-2"
        >
          <div>
            <p class="text-base uppercase text-white">{{ extra.name }}</p>
            <p class="text-sm uppercase text-primaryGreen">{{ extra.desc }}</p>
          </div>
          <div
            class="relative flex h-10 w-10 items-center justify-center border border-solid border-white/5 bg-weaponCard"
          >
            <Image
              :src="extra.image"
              :alt="extra.name"
            />
            <span
              class="absolute -right-1 -top-1 rounded-sm bg-primaryGreen px-0.5 text-center text-xs font-bold text-white"
            >
              x{{ extra.x }}
            </span>
          </div>
        </div>
      </div>
      <button
        class="flex items-center justify-center bg-primaryGreen px-9 py-5 text-base font-bold text-white"
      >
        Start crafting
      </button>
    </div>
  </div>
</template>
