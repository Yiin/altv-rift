<script setup lang="ts">
import { ItemSourceOrigin } from "@shared/interfaces";
import InventorySlot from "../InventorySlot.vue";
import { useInventory } from "@/store/inventory.store";

const inventory = useInventory();
</script>

<template>
  <h2 class="uppercase text-white text-2xl font-bold">global</h2>
  <div class="uppercase text-base text-deepGray">items on the floor or around you</div>
  <div class="inline-grid grid-cols-4 gap-2.5 mt-5">
    <InventorySlot v-for="item of inventory.groundItems"
      :key="item.source.originId"
      :source="item.source" />
    <InventorySlot v-for="(_, slot) in 24 - inventory.groundItems.length"
      :key="`slot-${inventory.groundItems.length + slot}`"
      :source="{ origin: ItemSourceOrigin.Ground, originId: -1 }" />
  </div>
</template>
