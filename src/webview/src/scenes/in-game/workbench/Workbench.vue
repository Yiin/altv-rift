<script setup lang="ts">
import { ref } from "vue";
import BackButtons from "@/components/buttons/BackButtons.vue";
import DarkBackground from "@/components/DarkBackground.vue";
import CraftingView from "@/scenes/in-game/workbench/CraftingView.vue";
import GearIcon from "../../../../public/assets/workbench/GearIcon.vue";
import WrenchIcon from "../../../../public/assets/workbench/WrenchIcon.vue";

enum View {
  CRAFTING,
  UPGRADES,
}

const links = [
  [View.CRAFTING, "Crafting"],
  [View.UPGRADES, "Upgrades"],
] as const;

const view = ref<View>(View.CRAFTING);
</script>

<template>
  <div class="relative flex h-full w-full flex-col px-20 py-11">
    <DarkBackground />
    <div class="mx-auto flex w-full items-center justify-between">
      <div class="w-40">
        <v-img :src="`./assets/workbench/logo.svg`" />
      </div>
      <div
        class="no-scrollbar mx-20 flex gap-2.5 overflow-x-auto whitespace-nowrap font-bold uppercase text-white"
      >
        <button
          v-for="[link, label] in links"
          :key="link"
          @click="view = link"
          class="h-[170px] w-[140px] px-11 py-3 text-lg font-extrabold uppercase"
          :class="{
            'text-white': view === link,
            'text-grey-500 transition duration-200': view !== link,
          }"
        >
          <div class="flex flex-col items-center justify-center">
            <img
              v-if="view === link"
              :src="`./assets/workbench/rectangle.svg`"
              class="absolute"
            />
            <WrenchIcon
              v-if="link === View.CRAFTING"
              :active="view === link"
              class="mb-4"
            />
            <GearIcon
              v-if="link === View.UPGRADES"
              :active="view === link"
              class="mb-4"
            />
            <span class="pb-2">
              {{ label }}
            </span>
            <div class="h-[12px] w-[74px]">
              <img
                v-if="view === link"
                :src="`./assets/workbench/ornament.svg`"
              />
            </div>
          </div>
        </button>
      </div>
      <BackButtons />
    </div>
    <CraftingView v-if="view === View.CRAFTING" />
    <UpgradesView v-else-if="view === View.UPGRADES" />
  </div>
</template>
