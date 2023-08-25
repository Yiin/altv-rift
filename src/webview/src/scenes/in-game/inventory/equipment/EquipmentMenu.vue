<script setup lang="ts">
import { usePlayerStore } from "@shared/store/player.store";
import EquipmentSlot from "./EquipmentSlot.vue";
import { computed } from "vue";
import { useInventorySlots } from "@/composables/use-inventory-slots";

const player = usePlayerStore();
const inventorySlots = useInventorySlots("equipment");

const gender = computed(() => player.character?.appearance.sex);
</script>

<template>
  <div
    @mousedown.stop
    @touchstart.stop
    class="relative bg-right bg-contain h-132.5"
    :style="{
      backgroundImage: gender
        ? `url(./assets/inventory/ManSilhouetteOutline.png)`
        : `url(./assets/inventory/WomanSilhouetteOutline.png)`,
    }"
  >
    <EquipmentSlot
      v-for="slot in ([
              'headwear',
              'glasses',
              'headwear',
              'earrings',
              'top',
              'shirt',
              'armor',
              'neckwear',
              'weapon',
              'ammo',
              'gloves',
              'lefthand',
              'pants',
              'righthand',
              'backpack',
              'shoes',
              'phone',
            ] as const)"
      :name="slot"
      :ref="(inventorySlots.setSlotRef as any)"
    />
  </div>
</template>
