<script setup lang="ts">
import { useGameState } from "@/store/synced/game-state.store";
import InventorySlot from "../InventorySlot.vue";

const gameState = useGameState();
</script>

<template>
  <template v-if="gameState.openedStorage">
    <h2 class="text-2xl font-bold uppercase text-white">{{ gameState.openedStorage.label }}</h2>
    <div class="text-base uppercase text-deepGray"></div>
    <div class="mt-5 inline-grid grid-cols-4 gap-2.5">
      <InventorySlot
        v-for="(_, slot) in gameState.openedStorage.inventory.size"
        :key="slot"
        :source="{ ...gameState.openedStorage.source, inventorySlot: slot }"
      />
    </div>
  </template>
</template>
