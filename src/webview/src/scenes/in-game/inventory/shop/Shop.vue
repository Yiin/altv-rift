<script setup lang="ts">
import ShopSlot from "./ShopSlot.vue";
import { useShop } from "@/store/shop.store";
import { useInventory } from "@/store/inventory.store";
import WeaponShop from "./weapon-shop/WeaponShop.vue";

const shop = useShop();
</script>

<template>
  <!-- <WeaponShop /> -->
  <div v-if="shop.interaction" class="flex flex-col">
    <div class="text-xl font-semibold crisp-shadow text-white uppercase tracking-wide p-1">
      Shop
    </div>
    <div @mousedown.stop @touchstart.stop class="relative grid grid-cols-5 px-1 py-1 bg-black/80">
      <ShopSlot v-for="i in shop.interaction.size" :shop="shop.interaction" :key="i" :slot="i - 1" />
    </div>
  </div>
</template>
