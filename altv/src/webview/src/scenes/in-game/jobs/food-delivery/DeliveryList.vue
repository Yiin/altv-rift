<script setup lang="ts">
import { computed } from "vue";
import type { PlayerDelivery } from "@shared/store/game-state.store";
import Icon from "@/components/Icon/Icon.vue";
import DeliveryCard from "./DeliveryCard.vue";

const props = defineProps<{
  deliveries: PlayerDelivery[];
  showCancelConfirm: number | null;
}>();

const emit = defineEmits<{
  selectDelivery: [id: number];
  promptCancelDelivery: [id: number, event?: Event];
  cancelDelivery: [id: number, event?: Event];
  closeCancelConfirm: [event?: Event];
}>();
</script>

<template>
  <div class="max-h-150 overflow-y-auto">
    <div
      v-if="deliveries.length === 0"
      class="p-8 text-center text-neutral-400"
    >
      <Icon
        name="mdi:food-outline"
        class="mx-auto mb-3 h-12 w-12 opacity-50"
      />
      <p>No active deliveries</p>
      <p class="mt-2 text-sm">Check back soon for new delivery opportunities</p>
    </div>

    <DeliveryCard
      v-for="delivery in deliveries"
      :key="delivery.id"
      :delivery="delivery"
      :show-cancel-confirm="showCancelConfirm"
      @select="(id) => emit('selectDelivery', id)"
      @prompt-cancel="(id, event) => emit('promptCancelDelivery', id, event)"
      @confirm-cancel="(id, event) => emit('cancelDelivery', id, event)"
      @close-cancel="(event) => emit('closeCancelConfirm', event)"
    />
  </div>
</template>
