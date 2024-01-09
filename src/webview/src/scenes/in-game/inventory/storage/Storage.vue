<script setup lang="ts">
import ShopSlot from "./StorageSlot.vue";
import { useStorage } from "@/store/storage.store";
import { useInventory } from "@/store/inventory.store";

const storage = useStorage();
</script>

<template>
  <div v-if="storage.interaction" class="flex flex-col">
    <div class="text-xl font-semibold crisp-shadow text-white uppercase tracking-wide p-1">
      Storage
    </div>
    <div @mousedown.stop @touchstart.stop class="relative grid grid-cols-7 px-1 py-1 bg-black/80">
      <StorageSlot v-for="i in storage.interaction.size" :storage="storage.interaction" :key="i" :slot="i - 1" />
    </div>
  </div>
</template>
