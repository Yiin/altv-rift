<script setup lang="ts">
import { ref } from "vue";

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
  <div class="relative flex h-full w-full flex-col justify-between px-20 py-11">
    <DarkBackground />
    <div class="mx-auto flex w-full items-center justify-between">
      <div class="w-40"><v-img :src="`./assets/vehicles/logo.png`" /></div>
      <div
        class="no-scrollbar mx-20 flex gap-2.5 overflow-x-auto whitespace-nowrap text-base font-bold uppercase text-white"
      >
        <button
          v-for="[link, label] in links"
          :key="link"
          @click="view = link"
          class="rounded-md border border-solid border-white/30 px-11 py-3 uppercase"
          :class="{
            'bg-sunriseYellow text-black shadow-sunriseYellow': view === link,
            'transition duration-200 hover:bg-white/10': view !== link,
          }"
        >
          {{ label }}
        </button>
      </div>
      <BackButtons />
    </div>
    <CraftingView v-if="view === View.CRAFTING" />
    <UpgradesView v-else-if="view === View.UPGRADES" />
  </div>
</template>
