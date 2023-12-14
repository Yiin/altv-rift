<script setup lang="ts">
import { computed } from "vue";
import ShopSlot from "./ShopSlot.vue";
import { useGameState } from "@/store/synced/game-state.store";

const gameState = useGameState();
const shop = computed(() => gameState.interaction?.source.origin === "shop" && gameState.interaction);

</script>

<template>
  <div v-if="shop" class="flex flex-col">
    <div class="text-xl font-semibold crisp-shadow text-white uppercase tracking-wide p-1">
      Trunk
    </div>
    <div @mousedown.stop @touchstart.stop class="relative grid grid-cols-7 px-1 py-1 bg-black/80">
      <ShopSlot v-for="i in shop.size" :shop="shop" :key="i" :slot="i - 1" />
    </div>
  </div>
</template>
