<script setup lang="ts">
import { useInventory } from "@/store/inventory.store";
import InventorySlot from "../InventorySlot.vue";

const inventory = useInventory();
</script>

<template>
  <div class="flex flex-col">
    <div class="text-xl font-semibold crisp-shadow text-white uppercase tracking-wide p-1">
      Inventory
    </div>
    <div @mousedown.stop @touchstart.stop class="relative grid grid-cols-5 px-1 py-1 bg-black/80">
      <!-- <button @click="eq = !eq" class="absolute top-4 -left-20 px-1.5 py-0.5 text-xs bg-neutral-900 rounded text-neutral-300">Equipment</button> -->
      <InventorySlot v-for="i in inventory.size" :key="i" :slot="i - 1" />
    </div>
  </div>
</template>
