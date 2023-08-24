<script setup lang="ts">
import { usePlayerStore } from "@shared/store/player.store";
import EquipmentSlot from "./EquipmentSlot.vue";
import { computed } from "vue";

const player = usePlayerStore();

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
    <EquipmentSlot name="mask" />
    <EquipmentSlot name="glasses" />
    <EquipmentSlot name="headwear" />
    <EquipmentSlot name="earrings" />
    <EquipmentSlot name="top" />
    <EquipmentSlot name="shirt" />
    <EquipmentSlot name="armor" />
    <EquipmentSlot name="neckwear" />
    <EquipmentSlot name="weapon" />
    <EquipmentSlot name="ammo" />
    <EquipmentSlot name="gloves" />
    <EquipmentSlot name="lefthand" />
    <EquipmentSlot name="pants" />
    <EquipmentSlot name="righthand" />
    <EquipmentSlot name="backpack" />
    <EquipmentSlot name="shoes" />
    <EquipmentSlot name="phone" />
  </div>
</template>
