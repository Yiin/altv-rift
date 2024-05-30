<script setup lang="ts">
import { computed } from "vue";
import { ItemSourceOrigin } from "@shared/interfaces";
import { getGroundItems } from "@/store/inventory";
import InventorySlot from "../InventorySlot.vue";

const groundItems = computed(() => getGroundItems());
</script>

<template>
  <h2 class="text-2xl font-bold uppercase text-white">global</h2>
  <div class="text-base uppercase text-deepGray">items on the floor or around you</div>
  <div class="mt-5 inline-grid grid-cols-4 gap-2.5">
    <InventorySlot
      v-for="item of groundItems"
      :key="item.source.originId"
      :source="item.source"
    />
    <InventorySlot
      v-for="(_, slot) in 24 - groundItems.length"
      :key="`slot-${groundItems.length + slot}`"
      :source="{ origin: ItemSourceOrigin.Ground, originId: -1 }"
    />
  </div>
</template>
