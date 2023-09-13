<script setup lang="ts">
import { useCharacter } from "@/store/synced/character.store";
import EquipmentSlot from "./EquipmentSlot.vue";
import { computed } from "vue";

const character = useCharacter();

const gender = computed(() => character.appearance.sex);
</script>

<template>
  <div @mousedown.stop @touchstart.stop class="relative bg-right bg-contain h-132.5" :style="{
    backgroundImage: gender
      ? `url(./assets/inventory/ManSilhouetteOutline.png)`
      : `url(./assets/inventory/WomanSilhouetteOutline.png)`,
  }">
    <EquipmentSlot v-for="slot in ([
      'headwear',
      'mask',
      'glasses',
      'headwear',
      'earrings',
      'top',
      'shirt',
      'armor',
      'accessory',
      'weapon',
      'ammo',
      'gloves',
      'lefthand',
      'pants',
      'righthand',
      'backpack',
      'shoes',
      'phone',
      'tool'
    ] as const)" :name="slot" />
  </div>
</template>
