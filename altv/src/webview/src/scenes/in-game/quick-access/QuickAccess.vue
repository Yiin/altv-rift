<script setup lang="ts">
import { EquipmentSlot as EquipmentSlotEnum } from "@shared/interfaces";
import EquipmentSlot from "../inventory/EquipmentSlot.vue";
</script>

<template>
  <div class="absolute bottom-0 flex w-full justify-center">
    <div class="relative mb-16 flex gap-2.5">
      <div class="bg-darkRadialGradient/80">
        <EquipmentSlot
          :name="EquipmentSlotEnum.QuickSlot1"
          dont-register
        />
      </div>
      <div class="bg-darkRadialGradient/80">
        <EquipmentSlot
          :name="EquipmentSlotEnum.QuickSlot2"
          dont-register
        />
      </div>
      <div class="bg-darkRadialGradient/80">
        <EquipmentSlot
          :name="EquipmentSlotEnum.QuickSlot3"
          dont-register
        />
      </div>
      <div class="bg-darkRadialGradient/80">
        <EquipmentSlot
          :name="EquipmentSlotEnum.QuickSlot4"
          dont-register
        />
      </div>
    </div>
  </div>
</template>
