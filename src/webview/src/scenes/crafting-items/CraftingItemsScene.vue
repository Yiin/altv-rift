<script setup lang="ts">
import { computed } from "vue";
import {
  FirearmWeaponBlueprint,
  ThrowableWeaponBlueprint,
  MeleeWeaponBlueprint,
  ToolBlueprint,
  ClothingBlueprint,
  AmmoBlueprint,
  WeaponComponentBlueprint,
} from "@shared/modules/production";
import BackButtons from "@/components/buttons/BackButtons.vue";
import { useCharacter } from "@/store/synced/character.store";

const character = useCharacter();

const categories = computed(() =>
  [
    {
      blueprint: FirearmWeaponBlueprint,
      name: "Firearm weapons",
      desc: "",
      background: "url(assets/crafting/firearm-weapons-category.webp) bottom",
      image: "assets/items/pistol-weapon.png",
    },
    {
      blueprint: MeleeWeaponBlueprint,
      name: "Melee weapons",
      desc: "",
      background: "url(assets/crafting/melee-weapons-category.jpg) center",
      image: "assets/items/melee-weapon.png",
    },
    {
      blueprint: ThrowableWeaponBlueprint,
      name: "Throwable weapons",
      desc: "",
      background: "url(assets/crafting/throwable-weapons-category.jpg) center",
      image: "assets/items/grenade.png",
    },
    {
      blueprint: ToolBlueprint,
      name: "Gathering tools",
      desc: "",
      background: "url(assets/crafting/gathering-tools-category.jpg) center 80%",
      image: "assets/items/hatchet.png",
    },
    {
      blueprint: AmmoBlueprint,
      name: "Weapon Ammo",
      desc: "",
      background: "url(assets/crafting/weapon-ammo-category.jpg) center",
      class: "bg-cover",
      image: "assets/items/handgunammo.png",
    },
    {
      blueprint: ClothingBlueprint,
      name: "Bulletproof Armor",
      desc: "",
      background: "url(assets/items/bulletproof-armor-category.jpg)",
      image: "assets/items/armor.png",
    },
    {
      blueprint: WeaponComponentBlueprint,
      name: "Weapon Components",
      desc: "",
      background: "url(assets/crafting/weapon-components-category.jpg)",
      image: "assets/items/suppressor.png",
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
</script>

<template>
  <div class="relative flex h-full w-full flex-col px-20 py-11">
    <DarkBackground />

    <div class="mx-auto flex w-full items-center justify-between">
      <div
        class="no-scrollbar mx-20 flex gap-2.5 overflow-x-auto whitespace-nowrap text-base font-bold uppercase text-white"
      >
        Crafting table
      </div>
      <BackButtons />
    </div>

    <!-- Main section -->
    <div class="faded-edges mt-1/5 flex w-full overflow-visible">
      <div
        class="no-scrollbar flex w-full shrink-0 flex-nowrap gap-4 overflow-x-auto overflow-y-visible px-40 py-10"
        v-horizontal-scroll
      >
        <div
          v-for="category in categories"
          :key="category.name"
          class="magic relative flex w-80 flex-shrink-0 cursor-pointer"
        >
          <div
            class="charm w-full flex-col justify-between bg-cover px-8 py-6"
            :style="{
              '--background-image': category.background,
            }"
          >
            <div class="flex flex-col">
              <!-- Leave some space for the image -->
              <div class="my-1 h-72" />

              <div class="flex items-end justify-between">
                <div class="max-w-36 text-3xl font-bold text-white drop-shadow-md">
                  {{ category.name }}
                </div>
                <div class="relative flex h-[50px] w-[50px] items-center justify-center">
                  <svg
                    class="absolute left-1/2 top-1/2 h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 -rotate-90 -scale-y-100"
                  >
                    <circle
                      class="text-white/30"
                      stroke-width="2.5"
                      stroke="currentColor"
                      fill="transparent"
                      r="22"
                      cx="25"
                      cy="25"
                    />
                    <circle
                      :class="[
                        category.low === category.high
                          ? 'stroke-green-500'
                          : category.low / category.high > 0.5
                            ? 'stroke-yellow-500'
                            : 'stroke-red-500',
                      ]"
                      stroke-width="2.5"
                      :stroke-dasharray="138"
                      :stroke-dashoffset="`${138 - ((category.low * 100) / category.high / 100) * 138}`"
                      stroke-linecap="butt"
                      fill="transparent"
                      r="22"
                      cx="25"
                      cy="25"
                    />
                  </svg>
                  <span class="text-xs font-extrabold text-white">
                    {{ category.low }} / {{ category.high }}
                  </span>
                </div>
              </div>
              <div class="mb-4 mt-8 text-base font-semibold text-zinc-200">
                {{ category.desc }}
              </div>
            </div>
          </div>
          <div
            class="uncharm absolute left-1/10 top-28 h-32 w-4/5 bg-variable bg-contain bg-center"
            :style="{
              '--bg': `url(${category.image})`,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.faded-edges {
  mask-image: linear-gradient(
    to right,
    transparent 4rem,
    black 10rem,
    black calc(100% - 10rem),
    transparent calc(100% - 4rem)
  );
}

.magic {
  .charm {
    transition: transform 0.3s;
    transform: rotateX(0) translateY(0) translateZ(0);
    background: linear-gradient(
        180deg,
        rgb(from #000 r g b / 0%) 40%,
        rgba(255, 218, 87, 0.01) 100%
      ),
      var(--background-image);
    background-size: cover;
  }
  .uncharm {
    transform: translate3d(0, 0, 0) scale(1);
    transition: transform 0.35s;
    filter: drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.5));
  }

  &:hover .charm {
    transform: perspective(900px) rotateX(15deg) translateY(-30px) translateZ(0);
    box-shadow: 2px 35px 30px -8px rgba(0, 0, 0, 0.2);
    background: linear-gradient(
        180deg,
        rgb(from #000 r g b / 50%) 30%,
        rgba(255, 218, 87, 0.01) 100%
      ),
      var(--background-image);
    background-size: cover;
  }
  &:hover .uncharm {
    transform: translate3d(0, -20px, 100px) scale(1.05);
    filter: drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.5));
  }
}
</style>
