<script setup lang="ts">
import EquipmentSlot from "./EquipmentSlot.vue";
import { onMounted, onUnmounted } from "vue";
import { ClientEvents } from "@shared/events/client";
import { useClient } from "@/store/synced/client.store";
import { WindowType } from "@shared/store/client.store";

const client = useClient();

onMounted(() => {
  alt.emit(ClientEvents.FromWebview.TOGGLE_PLAYER_PREVIEW, true);
});

onUnmounted(() => {
  alt.emit(ClientEvents.FromWebview.TOGGLE_PLAYER_PREVIEW, false);
});
</script>

<template>
  <div v-if="client.ui.window?.type === WindowType.PLAYER_INVENTORY">
    <div class="text-xl font-semibold crisp-shadow text-white uppercase tracking-wide p-1">
      Equipment
    </div>
    <div @mousedown.stop @touchstart.stop class="relative bg-right bg-contain h-132.5">
      <EquipmentSlot v-for="slot in ([
        'headwear',
        'mask',
        'glasses',
        'earrings',
        'top',
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
  </div>
</template>
