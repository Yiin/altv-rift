<script setup lang="ts">
import Screen from "@/components/Screen.vue";
import { ref } from "vue";
import Bg from "../../../public/assets/bg/weapon-module-bg.png";
import AdvancedRifle1 from "../../../public/assets/items/advancedrifle1.png";
import AssaultRifle1 from "../../../public/assets/items/assaultrifle1.png";
import CarbineRifle2 from "../../../public/assets/items/carbinerifle2.png";
import PipeBrushed from "../../../public/assets/items/pipe-brushed.png";
import Suppressor from "../../../public/assets/items/suppressor.png";
import AvailableModules from "./AvailableModules.vue";
import InstalledModules from "./InstalledModules.vue";
import WeaponryList from "./WeaponryList.vue";
import { AvailableWeaponModuleType, WeaponModuleType } from "./types";

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
        class="w-full h-full object-cover object-center bg-no-repeat"
        alt="crafting"
      />
    </div>

    <nav class="flex max-w-screen-2xl px-6 mx-auto py-8 justify-between items-center gap-7">
      <div>
        <a href="#">
          <p class="font-extrabold text-4xl text-white mb-1">Your weaponry</p>
          <span class="text-base text-limeZest inline-block max-w-[180px]">
            There are listed items you can customize and install new modules
          </span>
        </a>
      </div>
      <div class="flex gap-7 items-center">
        <button class="uppercase text-sm font-bold text-white">close</button>
        <button
          class="uppercase text-sm font-bold text-white py-3 px-2.5 border border-solid border-white/10"
        >
          esc
        </button>
      </div>
    </nav>

    <main
      class="max-w-screen-2xl p-6 mx-auto flex items-start gap-12 h-[calc(100vh_-_98px)] overflow-y-auto"
    >
      <WeaponryList :weaponModules="weaponModules" />
      <InstalledModules />
      <AvailableModules :availableModules="availableModules" />
    </main>
  </Screen>
</template>
