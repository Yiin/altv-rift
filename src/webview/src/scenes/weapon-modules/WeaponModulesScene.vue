<script setup lang="ts">
import { ref } from "vue";
import Screen from "@/components/Screen.vue";
import AvailableModules from "./AvailableModules.vue";
import InstalledModules from "./InstalledModules.vue";
import WeaponryList from "./WeaponryList.vue";
import { type AvailableWeaponModuleType, type WeaponModuleType } from "./types";

const Bg = "/assets/bg/weapon-module-bg.png";
const AdvancedRifle1 = "/assets/items/advancedrifle1.png";
const AssaultRifle1 = "/assets/items/assaultrifle1.png";
const CarbineRifle2 = "/assets/items/carbinerifle2.png";
const PipeBrushed = "/assets/items/pipe-brushed.png";
const Suppressor = "/assets/items/suppressor.png";

const weaponModules = ref<WeaponModuleType[]>([
  {
    name: "Carbine Rifle",
    image: CarbineRifle2,
    shortDesc: "Combining long distance accuracy with a high capacity magazine.",
    isActive: true,
  },
  {
    name: "Assault Rifle",
    image: AssaultRifle1,
    shortDesc: "Combining long distance accuracy with a high capacity magazine.",
    isActive: false,
  },
  {
    name: "Advanced Rifle",
    image: AdvancedRifle1,
    shortDesc: "Combining long distance accuracy with a high capacity magazine.",
    isActive: false,
  },
  {
    name: "Advanced Rifle",
    image: AdvancedRifle1,
    shortDesc: "Combining long distance accuracy with a high capacity magazine.",
    isActive: false,
  },
  {
    name: "Advanced Rifle",
    image: AdvancedRifle1,
    shortDesc: "Combining long distance accuracy with a high capacity magazine.",
    isActive: false,
  },
  {
    name: "Advanced Rifle",
    image: AdvancedRifle1,
    shortDesc: "Combining long distance accuracy with a high capacity magazine.",
    isActive: false,
  },
]);

const availableModules = ref<AvailableWeaponModuleType[]>([
  {
    name: "Suppressor",
    image: Suppressor,
    stage: 2,
    isActive: true,
    desc: "Silences but slightly reduces damage and range",
    price: 12450,
    extras: [
      {
        name: "Metal Pipes",
        image: PipeBrushed,
        desc: "Required to craft",
        x: "12",
      },
    ],
  },
  {
    name: "Suppressor",
    image: Suppressor,
    stage: 1,
    isActive: false,
    desc: "Silences but slightly reduces damage and range",
    price: 12450,
    extras: [
      {
        name: "Metal Pipes",
        image: PipeBrushed,
        desc: "Required to craft",
        x: "12",
      },
    ],
  },
  {
    name: "Suppressor",
    image: Suppressor,
    stage: 1,
    isActive: false,
    desc: "Silences but slightly reduces damage and range",
    price: 12450,
    extras: [
      {
        name: "Metal Pipes",
        image: PipeBrushed,
        desc: "Required to craft",
        x: "12",
      },
    ],
  },
  {
    name: "Suppressor",
    image: Suppressor,
    stage: 1,
    isActive: false,
    desc: "Silences but slightly reduces damage and range",
    price: 12450,
    extras: [
      {
        name: "Metal Pipes",
        image: PipeBrushed,
        desc: "Required to craft",
        x: "12",
      },
    ],
  },
]);
</script>

<template>
  <Screen>
    <div class="fixed inset-0 -z-10">
      <img
        :src="Bg"
        class="h-full w-full bg-no-repeat object-cover object-center"
        alt="crafting"
      />
    </div>

    <nav class="mx-auto flex max-w-screen-2xl items-center justify-between gap-7 px-6 py-8">
      <div>
        <a href="#">
          <p class="mb-1 text-4xl font-extrabold text-white">Your weaponry</p>
          <span class="inline-block max-w-[180px] text-base text-limeZest">
            There are listed items you can customize and install new modules
          </span>
        </a>
      </div>
      <div class="flex items-center gap-7">
        <button class="text-sm font-bold uppercase text-white">close</button>
        <button
          class="border border-solid border-white/10 px-2.5 py-3 text-sm font-bold uppercase text-white"
        >
          esc
        </button>
      </div>
    </nav>

    <main
      class="mx-auto flex h-[calc(100vh_-_98px)] max-w-screen-2xl items-start gap-12 overflow-y-auto p-6"
    >
      <WeaponryList :weaponModules="weaponModules" />
      <InstalledModules />
      <AvailableModules :availableModules="availableModules" />
    </main>
  </Screen>
</template>
