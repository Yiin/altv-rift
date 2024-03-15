<script setup lang="ts">
import { computed, ref } from "vue";
import { PistolBlueprint } from "@shared/modules/production/blueprints/pistol.blueprints";
import BackButtons from "@/components/buttons/BackButtons.vue";
import { useCharacter } from "@/store/synced/character.store";
import { type CraftingItemType } from "./types";

const Bg = "assets/bg/crafting-items-bg.png";
const GranadeWeapon = "assets/items/granade-weapon.png";
const MeleeWeapon = "assets/items/melee-weapon.png";
const RifleWeapon = "assets/items/rifle-weapon.png";
const SniperWeapon = "assets/items/sniper-weapon.png";

const character = useCharacter();

const categories = computed(() =>
  [
    {
      blueprint: PistolBlueprint,
      name: "Pistol weapons",
      desc: "A pistol is a type of handgun, characterized by a barrel with an integral chamber. The word 'pistol' is derived from the Middle French pistolet.",
      image: "assets/items/pistol-weapon.png",
      color: "#95C82A",
    },
  ]
    .map((category) => {
      const blueprints = character.blueprints.filter((blueprint) =>
        Object.values(category.blueprint).includes(blueprint),
      );

      return {
        ...category,
        low: blueprints.length,
        high: Object.values(category.blueprint).length,
      };
    })
    .filter((category) => category.low > 0),
);

const weapons = ref<CraftingItemType[]>([
  {
    name: "Rifle weapons",
    desc: "A rifle is a long-barreled firearm designed for accurate shooting and higher stopping power, with a barrel that has a helical pattern of grooves cut into the bore wall.",
    image: RifleWeapon,
    low: 2,
    high: 11,
    color: "#FF2431",
  },
  {
    name: "Sniper weapons",
    desc: "A pistol is a type of handgun, characterized by a barrel with an integral chamber. The word 'pistol' is derived from the Middle French pistolet.",
    image: SniperWeapon,
    low: 5,
    high: 11,
    color: "#FA8633",
  },
  {
    name: "Throwing grenades",
    desc: "A pistol is a type of handgun, characterized by a barrel with an integral chamber. The word 'pistol' is derived from the Middle French pistolet.",
    image: GranadeWeapon,
    low: 17,
    high: 20,
    color: "#3382FA",
  },
  {
    name: "Melee weapons",
    desc: "A pistol is a type of handgun, characterized by a barrel with an integral chamber. The word 'pistol' is derived from the Middle French pistolet.",
    image: MeleeWeapon,
    low: 2,
    high: 11,
    color: "#8E93FF",
  },
]);
</script>

<template>
  <div class="relative flex h-full w-full flex-col px-20 py-11">
    <div class="fixed inset-0 -z-10">
      <img
        :src="Bg"
        class="h-full w-full object-cover object-center"
        alt="weapon shop"
      />
      <div class="absolute inset-0 bg-subtleDarkRadialGradient opacity-95"></div>

      <div class="absolute inset-0 bg-black/20 blur-sm"></div>
    </div>
    <!-- <DarkBackground /> -->
    <div class="mx-auto flex w-full items-center justify-between">
      <div
        class="disableScrollBar mx-20 flex gap-2.5 overflow-x-auto whitespace-nowrap text-base font-bold uppercase text-white"
      >
        Crafting table
      </div>
      <BackButtons />
    </div>

    <!-- Main section -->

    <div class="faded-edges mt-1/5 flex w-full">
      <div
        class="flex flex-nowrap gap-4 overflow-x-auto px-40"
        v-horizontal-scroll
      >
        <template
          v-for="category in categories"
          :key="category.name"
        >
          <div
            class="flex w-80 cursor-pointer flex-col justify-between bg-white/5 px-8 py-6 transition-all duration-500 hover:bg-variable"
            :style="{
              '--bg': `linear-gradient(180deg, ${category.color} 0%, rgba(255, 218, 87, 0.01) 100%)`,
            }"
          >
            <div class="flex flex-col">
              <img
                :src="category.image"
                class="uncharm mb-10 mt-32 max-h-32 w-full object-cover object-center drop-shadow-2xl"
              />
              <div class="flex items-end justify-between">
                <div class="max-w-0 text-3xl font-bold text-white">{{ category.name }}</div>
                <div class="relative flex h-[50px] w-[50px] items-center justify-center">
                  <svg
                    class="absolute left-1/2 top-1/2 -z-10 h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 -rotate-90 -scale-y-100"
                  >
                    <circle
                      class="text-white/10"
                      stroke-width="2.5"
                      stroke="currentColor"
                      fill="transparent"
                      r="22"
                      cx="25"
                      cy="25"
                    ></circle>
                    <circle
                      stroke-width="2.5"
                      :stroke-dasharray="137.34"
                      :stroke-dashoffset="`${137.34 - ((category.low * 100) / category.high / 100) * 137.34}`"
                      stroke-linecap="butt"
                      :stroke="`${category.color}`"
                      fill="transparent"
                      r="22"
                      cx="25"
                      cy="25"
                    ></circle>
                  </svg>
                  <span class="text-xs font-extrabold text-white">
                    {{ category.low }} / {{ category.high }}
                  </span>
                </div>
              </div>
              <div class="mb-4 mt-8 text-base font-semibold text-zinc-500">{{ category.desc }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.faded-edges {
  mask-image: linear-gradient(
    to right,
    transparent 4rem,
    black 10rem,
    black calc(100% - 10rem),
    transparent calc(100% - 4rem)
  );
}

.magic:hover {
  transform: perspective(99vw) translateY(-5%) rotateX(25deg) translateZ(0);
  box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
}

.uncharm {
  transition: transform 0.5s;
}

.magic:hover .uncharm {
  transform: perspective(100%);
  /* translate3d(0%, -50px, 100px); */
}
</style>
