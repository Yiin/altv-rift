<script setup lang="ts">
import { computed } from "vue";
import type { PlayerDelivery } from "@shared/store/game-state.store";
import Icon from "@/components/Icon/Icon.vue";
import { useAccurateTimer } from "@/composables/use-accurate-timer";

const props = defineProps<{
  delivery: PlayerDelivery;
  showCancelConfirm: number | null;
}>();

const emit = defineEmits<{
  select: [id: number];
  promptCancel: [id: number, event?: Event];
  confirmCancel: [id: number, event?: Event];
  closeCancel: [event?: Event];
}>();

// Use the accurate timer composable
const { now } = useAccurateTimer();

// Get color class based on remaining time percentage
function getTimeColorClass(): string {
  const elapsed = now.value - props.delivery.startTime;
  const remaining = Math.max(0, props.delivery.timeLimit - elapsed);
  const percentage = remaining / props.delivery.timeLimit;

  if (percentage > 0.66) return "text-green-500";
  if (percentage > 0.33) return "text-yellow-500";
  return "text-red-500";
}

// Get delivery type badge classes
function getDeliveryTypeClasses(): string {
  return props.delivery.isPrivateHome
    ? "bg-violet-900 text-violet-100"
    : "bg-emerald-900 text-emerald-100";
}

// Get delivery status classes
function getDeliveryStatusClasses(): string {
  const elapsed = now.value - props.delivery.startTime;
  const isExpired = elapsed >= props.delivery.timeLimit;

  if (isExpired) return "bg-red-800 text-red-100";
  return "bg-sky-800 text-sky-100";
}

// Get status text
function getDeliveryStatusText(): string {
  const elapsed = now.value - props.delivery.startTime;
  const isExpired = elapsed >= props.delivery.timeLimit;

  if (isExpired) return "Expired";
  return "Delivering";
}

// Format time as MM:SS
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
</script>

<template>
  <div
    @click="emit('select', delivery.id)"
    class="cursor-pointer border-b border-neutral-800 p-4 transition-colors hover:bg-neutral-800/50"
  >
    <div class="mb-2 flex items-start justify-between">
      <div>
        <span
          class="me-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
          :class="getDeliveryTypeClasses()"
        >
          {{ delivery.isPrivateHome ? "Premium" : "Standard" }}
        </span>

        <span
          class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
          :class="getDeliveryStatusClasses()"
        >
          {{ getDeliveryStatusText() }}
        </span>
      </div>

      <span
        class="font-mono text-lg font-bold"
        :class="getTimeColorClass()"
      >
        {{ formatTime(delivery.timeLimit - (now - delivery.startTime)) }}
      </span>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-4">
      <div>
        <div class="mb-1 text-xs text-neutral-400">Pickup</div>
        <div class="text-sm text-white">Restaurant #{{ delivery.id }}</div>
      </div>

      <div>
        <div class="mb-1 text-xs text-neutral-400">Deliver to</div>
        <div class="text-sm text-white">
          {{
            "street" in delivery.deliveryPoint
              ? delivery.deliveryPoint.street
              : "Customer #" + delivery.id
          }}
        </div>
      </div>
    </div>

    <!-- Cancel button in list view -->
    <div class="mt-4 flex justify-end">
      <div
        v-if="showCancelConfirm === delivery.id"
        class="flex items-center space-x-2"
        @click.stop
      >
        <span class="text-xs text-neutral-300">Cancel delivery?</span>
        <button
          @click="emit('confirmCancel', delivery.id, $event)"
          class="rounded bg-red-700 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
        >
          Yes
        </button>
        <button
          @click="emit('closeCancel', $event)"
          class="rounded bg-neutral-700 px-2 py-1 text-xs font-medium text-white hover:bg-neutral-600"
        >
          No
        </button>
      </div>
      <button
        v-else
        @click="emit('promptCancel', delivery.id, $event)"
        class="rounded bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300 hover:bg-red-900 hover:text-white"
      >
        <Icon
          name="mdi:close-circle-outline"
          class="mr-1 w-4"
        />
        Cancel
      </button>
    </div>
  </div>
</template>
