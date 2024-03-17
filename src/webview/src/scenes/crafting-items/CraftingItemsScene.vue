<script setup lang="ts">
import { computed, ref } from "vue";
import { FirearmWeaponBlueprint } from "@shared/modules/production/blueprints/firearm-weapon.blueprints";
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
      blueprint: FirearmWeaponBlueprint,
      name: "Firearm weapons",
      desc: "",
      background:
        "url(https://media.discordapp.net/attachments/449125639077888000/1218323462372982784/image.png?ex=66073f24&is=65f4ca24&hm=e6d940bd4c4ba83409bfc82cf4e073052544e7ed4a2aa6bd8698b46850ab31ec&=&format=webp&quality=lossless) bottom",
      image: "assets/items/pistol-weapon.png",
    },
    {
      blueprint: FirearmWeaponBlueprint,
      name: "Melee weapons",
      desc: "",
      background:
        "url(https://cdn.leonardo.ai/users/dff1175f-28d6-4b1d-9dce-8c6d881d7fd4/generations/04841fd6-91f6-471f-9df3-363995944328/Default_even_sheet_of_old_workstation_wooden_table_texture_wal_0.jpg) center",
      image: "assets/items/melee-weapon.png",
    },
    {
      blueprint: FirearmWeaponBlueprint,
      name: "Throwable weapons",
      desc: "",
      background:
        "url(https://cdn.leonardo.ai/users/dff1175f-28d6-4b1d-9dce-8c6d881d7fd4/generations/31d3f50b-97c1-42a2-957a-95b9189ba2a2/Default_even_sheet_of_army_clothing_texture_wallpaper_1.jpg?w=512) center",
      image: "assets/items/grenade.png",
    },
    {
      blueprint: FirearmWeaponBlueprint,
      name: "Gathering tools",
      desc: "",
      background:
        "url(https://cdn.leonardo.ai/users/dff1175f-28d6-4b1d-9dce-8c6d881d7fd4/generations/07ef27bc-50b1-444e-9050-a467e3c02b02/Default_even_sheet_of_old_rigid_wooden_table_texture_wallpaper_0.jpg?w=512) center 80%",
      image: "assets/items/hatchet.png",
    },
    {
      blueprint: FirearmWeaponBlueprint,
      name: "Weapon Ammo",
      desc: "",
      background:
        "url(https://cdn.leonardo.ai/users/dff1175f-28d6-4b1d-9dce-8c6d881d7fd4/generations/e893812d-1d7c-454a-a2ea-ddcbd45ae846/Default_old_rugged_gritty_leather_cloth_texture_wallpaper_0.jpg) center",
      class: "bg-cover",
      image: "assets/items/handgunammo.png",
    },
    {
      blueprint: FirearmWeaponBlueprint,
      name: "Bulletproof Armor",
      desc: "",
      background:
        "url(https://cdn.leonardo.ai/users/dff1175f-28d6-4b1d-9dce-8c6d881d7fd4/generations/95ed03d2-3897-4eca-8486-11b051b75521/Default_even_sheet_of_modern_military_texture_wallpaper_0.jpg?w=512)",
      image: "assets/items/armor.png",
    },
    {
      blueprint: FirearmWeaponBlueprint,
      name: "Materials & Components",
      desc: "",
      background:
        "url(https://cdn.leonardo.ai/users/dff1175f-28d6-4b1d-9dce-8c6d881d7fd4/generations/cd305b47-f6a3-4e14-a1b8-79d81d02f878/Default_A_gritty_and_weathered_metallic_surface_The_texture_is_1.jpg?w=512)",
      image: "assets/items/rawdiamond.png",
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
    desc: "",
    image: SniperWeapon,
    low: 5,
    high: 11,
    color: "#FA8633",
  },
  {
    name: "Throwing grenades",
    desc: "",
    image: GranadeWeapon,
    low: 17,
    high: 20,
    color: "#3382FA",
  },
  {
    name: "Melee weapons",
    desc: "",
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
      <!-- <img
        :src="Bg"
        class="h-full w-full object-cover object-center"
        alt="weapon shop"
      /> -->
      <div class="absolute inset-0 bg-subtleDarkRadialGradient opacity-95"></div>

      <div class="absolute inset-0 bg-black/20 blur-sm"></div>
    </div>
    <!-- <DarkBackground /> -->
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
              <div class="mb-10 h-64" />
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
                    ></circle>
                    <circle
                      :class="[
                        category.low === category.high
                          ? 'stroke-green-500'
                          : category.low / category.high > 0.5
                            ? 'stroke-yellow-500'
                            : 'stroke-red-500',
                      ]"
                      stroke-width="2.5"
                      :stroke-dasharray="137.34"
                      :stroke-dashoffset="`${137.34 - ((category.low * 100) / category.high / 100) * 137.34}`"
                      stroke-linecap="butt"
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
              <div class="mb-4 mt-8 text-base font-semibold text-zinc-200">
                {{ category.desc }}
              </div>
            </div>
          </div>
          <div
            class="uncharm absolute top-28 h-32 w-full bg-variable bg-contain bg-center"
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
        rgb(from #000 r g b / 20%) 40%,
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
