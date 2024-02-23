<script setup lang="ts">
import { useGameState } from "@/store/synced/game-state.store";
import InventorySlot from "../InventorySlot.vue";

const gameState = useGameState();
</script>

<template>
  <template v-if="gameState.storage">
    <h2 class="uppercase text-white text-2xl font-bold">{{ gameState.storage.label }}</h2>
    <div class="uppercase text-base text-deepGray"></div>
    <div class="inline-grid grid-cols-4 gap-2.5 mt-5" @mousedown.stop @touchstart.stop>
      <InventorySlot v-for="(_, slot) in gameState.storage.size"
        :source="{ ...gameState.storage.source, inventorySlot: slot }" />
    </div>
  </template>
</template>
