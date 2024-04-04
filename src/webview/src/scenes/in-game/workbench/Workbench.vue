<script setup lang="ts">
import { ref } from "vue";
import BackButtons from "@/components/buttons/BackButtons.vue";
import DarkBackground from "@/components/DarkBackground.vue";
import CraftingView from "@/scenes/in-game/workbench/CraftingView.vue";
import UpgradesView from "@/scenes/in-game/workbench/UpgradesView.vue";
import GearIcon from "./icons/GearIcon.vue";
import WrenchIcon from "./icons/WrenchIcon.vue";

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
  <div class="relative flex h-full w-full flex-col px-20 py-20">
    <DarkBackground />
    <div class="mx-auto flex w-full items-center justify-between">
      <div class="w-40">
        <v-img :src="`./assets/workbench/logo.svg`" />
      </div>
      <div
        class="no-scrollbar absolute left-1/2 top-0 flex -translate-x-1/2 gap-2.5 overflow-x-auto whitespace-nowrap font-bold uppercase text-white"
      >
        <button
          v-for="[link, label] in links"
          :key="link"
          @click="view = link"
          class="h-[11.25rem] w-[8.75rem] py-3 text-lg font-extrabold uppercase"
          :class="{
            'text-white': view === link,
            'text-grey-500 transition duration-200': view !== link,
          }"
        >
          <div class="flex flex-col items-center justify-center">
            <img
              v-if="view === link"
              :src="`./assets/workbench/rectangle.svg`"
              class="absolute h-[11.25rem] w-[8.75rem]"
            />
            <WrenchIcon
              v-if="link === View.CRAFTING"
              :style="{ color: view === link ? '#EE2E24' : '#5D5D5D' }"
              class="mb-4 h-4 w-4"
            />
            <GearIcon
              v-if="link === View.UPGRADES"
              :style="{ color: view === link ? '#EE2E24' : '#5D5D5D' }"
              class="mb-4 h-4 w-4"
            />
            <span class="pb-2">
              {{ label }}
            </span>
            <div class="h-3 w-18.5">
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
