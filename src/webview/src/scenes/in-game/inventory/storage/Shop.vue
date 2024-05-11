<script setup lang="ts">
import { type ShopStorage } from "@shared/store/game-state.store";
import InventorySlot from "../InventorySlot.vue";

defineProps<ShopStorage>();
</script>

<template>
  <h2 class="text-2xl font-bold uppercase text-white">{{ label }}</h2>
  <div class="text-base uppercase text-deepGray"></div>
  <div class="mt-5 inline-grid grid-cols-4 gap-2.5">
    <InventorySlot
      v-for="(_, slot) in inventory.size"
      :key="slot"
      :source="{ ...source, inventorySlot: slot }"
    />
  </div>
</template>
