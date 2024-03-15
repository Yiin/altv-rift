<script setup lang="ts">
import { type RifleType } from "./types";

defineProps({
  activeRifle: {
    type: Object as () => RifleType,
    default: {} as RifleType,
  },
});
</script>

<template>
  <div class="w-full max-w-full border border-white/10 bg-transparent lg:w-auto lg:max-w-[300px]">
    <div
      class="flex items-center justify-between gap-12 border-b border-solid border-white/10 px-9 py-8"
    >
      <div class="">
        <h2 class="text-3xl text-white">{{ activeRifle.name }}</h2>
        <span class="text-base text-steelGray">{{ activeRifle.ammo }}</span>
      </div>
      <span
        :class="[
          `inline-block rounded-sm px-2 py-1 text-xs font-extrabold uppercase text-white`,
          activeRifle.tag.bgCol,
        ]"
      >
        {{ activeRifle.tag.text }}
      </span>
    </div>
    <div class="border-b border-solid border-white/10 px-9 py-8">
      <ul class="flex flex-col gap-4">
        <li class="flex items-center justify-between text-base uppercase text-white">
          <span>Damage</span>
          <span>{{ activeRifle.properties.damage }}</span>
        </li>
        <li class="flex items-center justify-between text-base uppercase text-white">
          <span>Firerate</span>
          <span>{{ activeRifle.properties.firerate }}</span>
        </li>
        <li class="flex items-center justify-between text-base uppercase text-white">
          <span>clip</span>
          <span>{{ activeRifle.properties.clip }}</span>
        </li>
        <li class="flex items-center justify-between text-base uppercase text-white">
          <span>accuracy</span>
          <span>{{ activeRifle.properties.accuracy }}</span>
        </li>
      </ul>
    </div>
    <div class="border-b border-solid border-white/10 px-9 py-8">
      <h2 class="mb-3 text-3xl uppercase text-white">requirments</h2>
      <ul class="flex flex-col gap-2">
        <li
          v-for="req in activeRifle.requirements"
          :key="req.name"
          class="flex items-center gap-4"
        >
          <div class="border border-solid border-white/5 bg-transparent p-3">
            <img
              :src="req.image"
              :alt="req.name"
            />
          </div>
          <p class="text-base text-white">{{ req.name }}</p>
        </li>
      </ul>
    </div>
    <div class="border-b border-solid border-white/10 px-9 py-8">
      <h2 class="mb-3 text-3xl uppercase text-white">crafting information</h2>
      <ul class="flex flex-col gap-4">
        <li class="flex items-center justify-between text-base uppercase text-white">
          <span>chance</span>
          <span>{{ activeRifle.craftingInfo.chance }}%</span>
        </li>
        <li class="flex items-center justify-between text-base uppercase text-white">
          <span>crafting time</span>
          <span>{{ activeRifle.craftingInfo.time }}</span>
        </li>
      </ul>
    </div>
    <button
      class="flex w-full items-center justify-center bg-mustardYellow px-9 py-5 text-base font-bold text-midnightCharcoal"
    >
      Start crafting
    </button>
  </div>
</template>
