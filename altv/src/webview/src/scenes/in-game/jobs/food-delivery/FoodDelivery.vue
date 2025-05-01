<script setup lang="ts">
import { computed, ref } from "vue";
import type { PlayerDelivery } from "@shared/store/game-state.store";
import { getLevel, getMissingExperience } from "@shared/modules/experience/experience-table";
import { calculateTipChance, getDeliveryPointPosition } from "@shared/modules/jobs/food-delivery";
import { ServerCall } from "@shared/calls/server";
import Window from "@/components/Window.vue";
import Icon from "@/components/Icon/Icon.vue";
import { useGameState } from "@/store/synced/game-state.store";
import { px } from "@/composables/use-pixel";
import { useAccurateTimer } from "@/composables/use-accurate-timer";
import { useCharacter } from "@/store/synced/character.store";
import { rpc } from "@/rpc";
import DeliveryList from "./DeliveryList.vue";
import DeliveryDetail from "./DeliveryDetail.vue";
import DeliveryStats from "./DeliveryStats.vue";

// Stores
const gameState = useGameState();
const character = useCharacter();

// UI State
const selectedDeliveryId = ref<number | null>(null);
const showStats = ref(false);
const showCancelConfirm = ref<number | null>(null);

// Use the accurate timer composable
const { now } = useAccurateTimer();

// Window position
const defaultPosition = computed(() => {
  return {
    x: window.innerWidth - px(600),
    y: px(300),
    w: px(400),
    h: px(500),
  };
});

// Active deliveries
const activeDeliveries = computed(() => {
  // Convert Map to Array for easier rendering
  const deliveries: Array<PlayerDelivery> = [];
  gameState.foodDelivery.activeDeliveries.forEach((delivery) => {
    deliveries.push({
      id: delivery.id,
      collectionPoint: delivery.collectionPoint,
      deliveryPoint: delivery.deliveryPoint,
      isPrivateHome: delivery.isPrivateHome,
      timeLimit: delivery.timeLimit,
      startTime: delivery.startTime,
      bonus: delivery.bonus,
    });
  });
  return deliveries;
});

// Selected delivery details
const selectedDelivery = computed(() => {
  if (!selectedDeliveryId.value) return null;
  return (
    activeDeliveries.value.find((delivery) => delivery.id === selectedDeliveryId.value) || null
  );
});

// Timer calculations for selected delivery
const remainingTime = computed(() => {
  if (!selectedDelivery.value) return 0;

  const elapsed = now.value - selectedDelivery.value.startTime;
  const remaining = Math.max(0, selectedDelivery.value.timeLimit - elapsed);
  return remaining;
});

// Format time as MM:SS
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Get color class based on remaining time percentage
function getTimeColorClass(delivery: (typeof activeDeliveries.value)[0]): string {
  const elapsed = now.value - delivery.startTime;
  const remaining = Math.max(0, delivery.timeLimit - elapsed);
  const percentage = remaining / delivery.timeLimit;

  if (percentage > 0.66) return "text-green-500";
  if (percentage > 0.33) return "text-yellow-500";
  return "text-red-500";
}

// Get delivery type badge classes
function getDeliveryTypeClasses(isPrivateHome: boolean): string {
  return isPrivateHome ? "bg-violet-900 text-violet-100" : "bg-emerald-900 text-emerald-100";
}

// Get delivery status classes
function getDeliveryStatusClasses(delivery: (typeof activeDeliveries.value)[0]): string {
  const elapsed = now.value - delivery.startTime;
  const isExpired = elapsed >= delivery.timeLimit;

  if (isExpired) return "bg-red-800 text-red-100";
  return "bg-sky-800 text-sky-100";
}

// Get status text
function getDeliveryStatusText(delivery: (typeof activeDeliveries.value)[0]): string {
  const elapsed = now.value - delivery.startTime;
  const isExpired = elapsed >= delivery.timeLimit;

  if (isExpired) return "Expired";
  return "Delivering";
}

function getTipChance(delivery: (typeof activeDeliveries.value)[0]): number {
  return calculateTipChance(
    character.skills.foodDelivery.exp,
    (now.value - delivery.startTime) / delivery.timeLimit,
  ).chance;
}

// Select a delivery
function selectDelivery(id: number) {
  selectedDeliveryId.value = id;
}

// Close details and return to list
function closeDetails() {
  selectedDeliveryId.value = null;
}

// Toggle stats view
function toggleStats() {
  showStats.value = !showStats.value;
}

// Show cancel confirmation
function promptCancelDelivery(id: number, event?: Event) {
  if (event) {
    event.stopPropagation();
  }
  showCancelConfirm.value = id;
}

// Cancel the delivery
function cancelDelivery(id: number, event?: Event) {
  if (event) {
    event.stopPropagation();
  }
  // Emit an event for the backend to handle the cancellation
  rpc.callServer(ServerCall.FromWebview.FOOD_DELIVERY_CANCEL, id);

  // Remove from local UI right away for responsive feel
  if (selectedDeliveryId.value === id) {
    closeDetails();
  }
  showCancelConfirm.value = null;
}

// Close cancel confirmation
function closeCancelConfirm(event?: Event) {
  if (event) {
    event.stopPropagation();
  }
  showCancelConfirm.value = null;
}

// Navigate to pickup location
function navigateToPickup() {
  if (!selectedDelivery.value?.id) return;

  rpc.callServer(ServerCall.FromWebview.FOOD_DELIVERY_NAVIGATE, {
    id: selectedDelivery.value.id,
    type: "pickup",
  });
}

// Navigate to delivery location
function navigateToDelivery() {
  if (!selectedDelivery.value?.id) return;

  rpc.callServer(ServerCall.FromWebview.FOOD_DELIVERY_NAVIGATE, {
    id: selectedDelivery.value.id,
    type: "delivery",
  });
}
</script>

<template>
  <Window
    name="foodDelivery"
    :minw="defaultPosition.w"
    :x="defaultPosition.x"
    :y="defaultPosition.y"
    :is-active="false"
    :sticks="[]"
  >
    <div
      class="divide-y divide-neutral-800 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
    >
      <!-- Header with navigation -->
      <div class="flex items-center justify-between bg-neutral-950 p-4">
        <h3 class="text-lg font-bold text-white sm:text-xl">
          <span v-if="selectedDelivery">
            <button
              @click="closeDetails"
              class="mr-2 text-neutral-400 hover:text-white"
            >
              <Icon
                name="mdi:chevron-left"
                class="w-5"
              />
            </button>
            Delivery #{{ selectedDeliveryId }}
          </span>
          <span v-else>Food Delivery Jobs</span>
        </h3>

        <div class="flex gap-2">
          <button
            @click="toggleStats"
            class="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800"
            :class="{ 'bg-neutral-800': showStats }"
          >
            <Icon
              name="mdi:chart-box-outline"
              class="w-5"
            />
          </button>
        </div>
      </div>

      <!-- Render the appropriate component based on the view state -->
      <DeliveryList
        v-if="!selectedDelivery && !showStats"
        :deliveries="activeDeliveries"
        :show-cancel-confirm="showCancelConfirm"
        @select-delivery="selectDelivery"
        @prompt-cancel-delivery="promptCancelDelivery"
        @cancel-delivery="cancelDelivery"
        @close-cancel-confirm="closeCancelConfirm"
      />

      <DeliveryDetail
        v-if="selectedDelivery"
        :delivery="selectedDelivery"
        :show-cancel-confirm="showCancelConfirm"
        :character-exp="character.skills.foodDelivery.exp"
        @navigate-to-pickup="navigateToPickup"
        @navigate-to-delivery="navigateToDelivery"
        @prompt-cancel-delivery="promptCancelDelivery"
        @cancel-delivery="cancelDelivery"
        @close-cancel-confirm="closeCancelConfirm"
      />

      <DeliveryStats
        v-if="showStats && !selectedDelivery"
        :character-skills="character.skills"
      />
    </div>
  </Window>
</template>

<style scoped>
.bg-neutral-850 {
  background-color: #1a1a1a;
}
</style>
