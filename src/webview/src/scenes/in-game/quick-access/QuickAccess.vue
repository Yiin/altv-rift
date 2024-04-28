<script setup lang="ts">
import { EquipmentSlot as EquipmentSlotEnum } from "@shared/interfaces";
import EquipmentSlot from "../inventory/EquipmentSlot.vue";
</script>

<template>
  <div class="absolute bottom-0 flex w-full justify-center">
    <div class="relative mb-16 flex gap-2.5">
      <div class="bg-darkRadialGradient/80">
        <EquipmentSlot :name="EquipmentSlotEnum.QuickSlot1" />
      </div>
      <div class="bg-darkRadialGradient/80">
        <EquipmentSlot :name="EquipmentSlotEnum.QuickSlot2" />
      </div>
      <div class="bg-darkRadialGradient/80">
        <EquipmentSlot :name="EquipmentSlotEnum.QuickSlot3" />
      </div>
      <div class="bg-darkRadialGradient/80">
        <EquipmentSlot :name="EquipmentSlotEnum.QuickSlot4" />
      </div>
    </div>
  </div>
</template>
