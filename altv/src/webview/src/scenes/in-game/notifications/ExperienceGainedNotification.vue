<script setup lang="ts">
import { computed } from "vue";
import { getLevel, getLevelProgress, isLevelUp } from "@shared/modules/experience/experience-table";
import { useClient } from "@/store/synced/client.store";

const props = defineProps<{
  type: "fishing" | "mining" | "woodcutting";
  previousXp: number;
  currentXp: number;
}>();

const currentLevel = computed(() => getLevel(props.currentXp));
const nextLevel = computed(() => currentLevel.value + 1);

const iconName = computed(() => {
  if (isLevelUp(props.previousXp, props.currentXp)) {
    return "experience-icon.svg";
  }
  switch (props.type) {
    case "fishing":
      return "fishing-icon.svg";
    case "woodcutting":
      return "woodcutting-icon.svg";
    case "mining":
      return "mining-icon.svg";
    default:
      return "experience-icon.svg";
  }
});

const isWindowOpened = computed(() => useClient().ui.window !== null);
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-2.5"
    :class="[isWindowOpened && '-mt-4 rounded-3xl bg-black/95 p-4']"
  >
    <div
      class="h-8.5 w-12 bg-contain bg-center"
      :style="{ backgroundImage: `url(./assets/skills/${iconName})` }"
    />
    <div class="text-center text-sm font-bold uppercase leading-[0] text-white drop-shadow-light">
      {{ type }}
    </div>
    <div class="flex items-center justify-center gap-2.5">
      <div class="text-center text-base font-bold text-white drop-shadow-light">
        {{ currentLevel }}
      </div>
      <div class="relative -top-0.75 w-36">
        <div class="absolute left-0 top-0 h-1.5 w-full rounded-lg bg-black/25"></div>
        <div
          class="absolute left-0 top-0 h-1.5 rounded-lg bg-amber-300"
          :style="{ width: `${getLevelProgress(currentXp)}%` }"
        ></div>
      </div>
      <div class="text-center text-base font-bold text-white drop-shadow-light">
        {{ nextLevel }}
      </div>
    </div>
    <div class="text-center text-sm font-semibold leading-[0] text-white drop-shadow-light">
      +{{ currentXp - previousXp }} XP
    </div>
  </div>
</template>
