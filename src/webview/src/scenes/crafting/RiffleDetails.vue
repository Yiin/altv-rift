<script setup lang="ts">
import { defineProps } from "vue";
import { RifleType } from "./types";

const props = defineProps({
  activeRifle: {
    type: Object as () => RifleType,
    default: {} as RifleType,
  },
});
</script>

<template>
  <div class="bg-transparent border border-white/10 max-w-md">
    <div
      class="py-8 px-9 border-b border-solid border-white/10 flex gap-12 justify-between items-center"
    >
      <div class="">
        <h2 class="text-white text-3xl">{{ activeRifle.name }}</h2>
        <span class="text-base text-steelGray">{{ activeRifle.ammo }}</span>
      </div>
      <span
        :class="[
          `inline-block px-2 py-1 text-xs font-extrabold rounded-sm uppercase text-white`,
          activeRifle.tag.bgCol,
        ]"
      >
        {{ activeRifle.tag.text }}
      </span>
    </div>
    <div class="py-8 px-9 border-b border-solid border-white/10">
      <ul class="flex flex-col gap-4">
        <li class="flex justify-between items-center text-base text-white uppercase">
          <span>Damage</span>
          <span>{{ activeRifle.properties.damage }}</span>
        </li>
        <li class="flex justify-between items-center text-base text-white uppercase">
          <span>Firerate</span>
          <span>{{ activeRifle.properties.firerate }}</span>
        </li>
        <li class="flex justify-between items-center text-base text-white uppercase">
          <span>clip</span>
          <span>{{ activeRifle.properties.clip }}</span>
        </li>
        <li class="flex justify-between items-center text-base text-white uppercase">
          <span>accuracy</span>
          <span>{{ activeRifle.properties.accuracy }}</span>
        </li>
      </ul>
    </div>
    <div class="py-8 px-9 border-b border-solid border-white/10">
      <h2 class="text-white text-3xl uppercase mb-3">requirments</h2>
      <ul class="flex gap-2 flex-col">
        <li
          v-for="req in activeRifle.requirements"
          :key="req.name"
          class="flex gap-4 items-center"
        >
          <div class="p-3 border border-solid border-white/5 bg-transparent">
            <img
              :src="req.image"
              :alt="req.name"
            />
          </div>
          <p class="text-base text-white">{{ req.name }}</p>
        </li>
      </ul>
    </div>
    <div class="py-8 px-9 border-b border-solid border-white/10">
      <h2 class="text-white text-3xl uppercase mb-3">crafting information</h2>
      <ul class="flex flex-col gap-4">
        <li class="flex justify-between items-center text-base text-white uppercase">
          <span>chance</span>
          <span>{{ activeRifle.craftingInfo.chance }}%</span>
        </li>
        <li class="flex justify-between items-center text-base text-white uppercase">
          <span>crafting time</span>
          <span>{{ activeRifle.craftingInfo.time }}</span>
        </li>
      </ul>
    </div>
    <button
      class="py-5 px-9 flex justify-center items-center bg-mustardYellow text-midnightCharcoal text-base font-bold w-full"
    >
      Start crafting
    </button>
  </div>
</template>
