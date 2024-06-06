<script setup lang="ts">
import { ref } from "vue";
import BackButtons from "@/components/buttons/BackButtons.vue";
import DarkBackground from "@/components/DarkBackground.vue";
import CraftingView from "@/scenes/in-game/workbench/CraftingView.vue";
import UpgradingView from "@/scenes/in-game/workbench/UpgradingView.vue";
import { asset } from "@/utils/asset";
import GearIcon from "./icons/GearIcon.vue";
import WrenchIcon from "./icons/WrenchIcon.vue";

enum View {
  CRAFTING,
  UPGRADING,
}

const links = [
  [View.CRAFTING, "Crafting"],
  [View.UPGRADING, "Upgrades"],
] as const;

const view = ref<View>(View.CRAFTING);
</script>

<template>
  <div class="relative flex h-full w-full flex-col px-20 pb-17 pt-20">
    <DarkBackground bg-class="bg-black" />
    <div class="mx-auto flex w-full items-center justify-between">
      <div class="pointer-events-none">
        <v-img
          :src="asset(`assets/workbench/logo.svg`)"
          class="h-[3.88875rem] w-[9.84rem]"
        />
      </div>
      <div class="absolute -top-2.5 left-1/2 flex -translate-x-1/2 gap-1">
        <div
          v-for="[link, label] in links"
          :key="link"
          @click="view = link"
          class="flex h-45 w-35 flex-col items-center justify-end pb-6.75"
          :class="{
            'text-white': view === link,
            'text-gray-500 transition duration-200': view !== link,
            'bg-contain': view === link,
          }"
          :style="{ backgroundImage: `url(${asset(`assets/workbench/rectangle.svg`)})` }"
        >
          <WrenchIcon
            v-if="link === View.CRAFTING"
            :active="view === link"
            class="-mb-2 h-11.5 w-11.5"
          />
          <GearIcon
            v-if="link === View.UPGRADING"
            :active="view === link"
            class="-mb-2 h-11.5 w-11.5"
          />
          <span class="mb-1 text-lg font-bold uppercase tracking-[0.03125rem]">
            {{ label }}
          </span>
          <img
            :src="asset(`assets/workbench/ornament.svg`)"
            class="h-3 w-18.5"
            :class="[view === link ? 'visible' : 'invisible']"
          />
        </div>
      </div>
      <BackButtons />
    </div>
    <CraftingView v-if="view === View.CRAFTING" />
    <UpgradingView v-else-if="view === View.UPGRADING" />
  </div>
</template>
