<script setup lang="ts">
import CraftingRecipes from "./crafting/CraftingRecipes.vue";
import CraftingProgress from "./crafting/CraftingProgress.vue";
import CraftingDetails from "./crafting/CraftingDetails.vue";
</script>

<template>
  <div class="relative mt-17 flex flex-grow justify-between gap-10 text-white">
    <CraftingRecipes class="absolute left-0 top-0" />
    <CraftingProgress
      class="align-self-center absolute left-1/2 top-2 max-w-190 -translate-x-1/2"
    />
    <CraftingDetails class="self-right absolute right-0 top-11.5 h-full w-70" />
  </div>
</template>
