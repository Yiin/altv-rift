<script setup lang="ts">
import { computed } from "vue";
import type { PlayerDelivery } from "@shared/store/game-state.store";
import { calculateTipChance } from "@shared/modules/jobs/food-delivery";
import Icon from "@/components/Icon/Icon.vue";
import { useAccurateTimer } from "@/composables/use-accurate-timer";
import TimeDisplay from "./TimeDisplay.vue";

const props = defineProps<{
  delivery: PlayerDelivery;
  showCancelConfirm: number | null;
  characterExp: number;
}>();

const emit = defineEmits<{
  navigateToPickup: [];
  navigateToDelivery: [];
  promptCancelDelivery: [id: number];
  cancelDelivery: [id: number];
  closeCancelConfirm: [];
}>();

// Use the accurate timer composable
const { now } = useAccurateTimer();

// Timer calculations for delivery
const remainingTime = computed(() => {
  const elapsed = now.value - props.delivery.startTime;
  const remaining = Math.max(0, props.delivery.timeLimit - elapsed);
  return remaining;
});

// Get delivery type badge classes
function getDeliveryTypeClasses(): string {
  return props.delivery.isPrivateHome
    ? "bg-violet-900 text-violet-100"
    : "bg-emerald-900 text-emerald-100";
}

function getTipChance(): number {
  return calculateTipChance(
    props.characterExp,
    (now.value - props.delivery.startTime) / props.delivery.timeLimit,
  ).chance;
}
</script>

<template>
  <div class="p-4">
    <!-- Timer section -->
    <div class="mb-6 text-center">
      <div class="mb-1 text-sm text-neutral-400">Time Remaining</div>
      <TimeDisplay
        :time-remaining="remainingTime"
        :total-time="delivery.timeLimit"
        size="large"
        :show-progress-bar="true"
      />
    </div>

    <!-- Delivery info cards -->
    <div class="mb-4 grid grid-cols-1 gap-4">
      <!-- Pickup location -->
      <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-4">
        <div class="mb-2 flex items-center justify-between">
          <h4 class="flex font-medium text-white">
            <Icon
              name="mdi:store-outline"
              class="mr-1 w-5"
            />
            Pickup Location
          </h4>
          <span
            class="inline-flex items-center rounded-md bg-green-800 px-2 py-1 text-xs font-medium text-green-100"
          >
            Collected
          </span>
        </div>

        <div class="text-sm text-white">Restaurant #{{ delivery.id }}</div>
        <div class="mt-2">
          <button
            @click="emit('navigateToPickup')"
            class="rounded bg-blue-700 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
          >
            <Icon
              name="mdi:map-marker"
              class="mr-1 w-4"
            />
            Navigate
          </button>
        </div>
      </div>

      <!-- Delivery location -->
      <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-4">
        <div class="mb-2 flex items-center justify-between">
          <h4 class="flex font-medium text-white">
            <Icon
              name="mdi:map-marker-outline"
              class="mr-1 w-5"
            />
            Delivery Location
          </h4>
          <span
            class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
            :class="getDeliveryTypeClasses()"
          >
            {{ delivery.isPrivateHome ? "Premium" : "Standard" }}
          </span>
        </div>

        <div class="text-sm text-white">
          {{
            "street" in delivery.deliveryPoint
              ? delivery.deliveryPoint.street
              : "Customer #" + delivery.id
          }}
        </div>
        <div class="mt-2">
          <button
            @click="emit('navigateToDelivery')"
            class="rounded bg-blue-700 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
          >
            <Icon
              name="mdi:map-marker"
              class="mr-1 w-4"
            />
            Navigate
          </button>
        </div>
      </div>

      <!-- Reward info -->
      <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-4">
        <h4 class="mb-2 flex font-medium text-white">
          <Icon
            name="mdi:currency-usd"
            class="mr-1 w-5"
          />
          Reward Details
        </h4>

        <div class="grid grid-cols-4 gap-2">
          <div>
            <div class="text-xs text-neutral-400">Base Reward</div>
            <div class="text-sm text-white">$80 - $120</div>
          </div>

          <div v-if="getTipChance()">
            <div class="text-xs text-neutral-400">Tip Chance</div>
            <div class="text-sm text-white">{{ getTipChance() }}%</div>
          </div>

          <div v-if="delivery.isPrivateHome">
            <div class="text-xs text-neutral-400">Premium Bonus</div>
            <div class="text-sm text-white">+${{ delivery.bonus }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery steps -->
    <div class="overflow-hidden rounded-lg border border-neutral-800">
      <div class="bg-neutral-800 p-3 font-medium text-white">Delivery Progress</div>

      <div class="p-4">
        <div class="relative">
          <!-- Progress line -->
          <div class="absolute top-0 bottom-0 left-4 w-0.5 bg-neutral-700"></div>

          <!-- Steps -->
          <div class="relative mb-6 flex items-start">
            <div
              class="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-800 text-green-100"
            >
              <Icon
                name="mdi:check"
                class="w-5"
              />
            </div>
            <div class="ml-4 pt-1">
              <h4 class="font-medium text-white">Delivery Accepted</h4>
              <p class="text-xs text-neutral-400">
                {{ new Date(delivery.startTime).toLocaleTimeString() }}
              </p>
            </div>
          </div>

          <div class="relative flex items-start">
            <div
              class="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 text-neutral-400"
            >
              <Icon
                name="mdi:map-marker"
                class="w-5"
              />
            </div>
            <div class="ml-4 pt-1">
              <h4 class="font-medium text-white">Food Delivery</h4>
              <p class="text-xs text-neutral-400">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel delivery button in detail view -->
    <div class="mt-6">
      <div
        v-if="showCancelConfirm === delivery.id"
        class="bg-neutral-850 rounded-lg border border-neutral-800 p-4"
      >
        <p class="mb-3 text-center text-neutral-300">
          Are you sure you want to cancel this delivery?
        </p>
        <div class="flex justify-center space-x-3">
          <button
            @click="emit('cancelDelivery', delivery.id)"
            class="rounded-lg bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-600"
          >
            Yes, Cancel Delivery
          </button>
          <button
            @click="emit('closeCancelConfirm')"
            class="rounded-lg bg-neutral-700 px-4 py-2 font-medium text-white hover:bg-neutral-600"
          >
            No, Keep Delivery
          </button>
        </div>
      </div>
      <button
        v-else
        @click="emit('promptCancelDelivery', delivery.id)"
        class="w-full rounded-lg bg-neutral-800 py-3 font-medium text-neutral-300 hover:bg-red-900 hover:text-white"
      >
        <Icon
          name="mdi:close-circle-outline"
          class="mr-1 w-5 align-text-bottom"
        />
        Cancel Delivery
      </button>
    </div>
  </div>
</template>
