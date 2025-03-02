<script setup lang="ts">
import { computed, ref } from "vue";
import { PlayerFlags } from "@shared/store/game-state.store";
import Window from "@/components/Window.vue";
import Icon from "@/components/Icon/Icon.vue";
import { useGameState } from "@/store/synced/game-state.store";
import { useUser } from "@/store/synced/user.store";
import { px } from "@/composables/use-pixel";
import { useAccurateTimer } from "@/composables/use-accurate-timer";

// Stores
const gameState = useGameState();
const user = useUser();

// UI State
const selectedDeliveryId = ref<number | null>(null);
const showStats = ref(false);

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
  const deliveries: Array<{
    id: number;
    collectionPoint: { x: number; y: number; z: number };
    deliveryPoint: { x: number; y: number; z: number; name?: string };
    isPrivateHome: boolean;
    timeLimit: number;
    startTime: number;
    bonus: number;
    nextDeliveryTime: number;
    isCollected?: boolean;
  }> = [];

  gameState.foodDelivery.activeDeliveries.forEach((delivery, id) => {
    deliveries.push({
      id,
      ...delivery,
      // We'll need to implement this in the backend to track if food is collected
      isCollected: false,
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
  if (delivery.isCollected) return "bg-sky-800 text-sky-100";
  return "bg-amber-800 text-amber-100";
}

// Get status text
function getDeliveryStatusText(delivery: (typeof activeDeliveries.value)[0]): string {
  const elapsed = now.value - delivery.startTime;
  const isExpired = elapsed >= delivery.timeLimit;

  if (isExpired) return "Expired";
  if (delivery.isCollected) return "Delivering";
  return "Pick Up";
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

      <!-- Deliveries list view -->
      <div
        v-if="!selectedDelivery && !showStats"
        class="max-h-150 overflow-y-auto"
      >
        <div
          v-if="activeDeliveries.length === 0"
          class="p-8 text-center text-neutral-400"
        >
          <Icon
            name="mdi:food-outline"
            class="mx-auto mb-3 h-12 w-12 opacity-50"
          />
          <p>No active deliveries</p>
          <p class="mt-2 text-sm">Check back soon for new delivery opportunities</p>
        </div>

        <div
          v-for="delivery in activeDeliveries"
          :key="delivery.id"
          @click="selectDelivery(delivery.id)"
          class="cursor-pointer border-b border-neutral-800 p-4 transition-colors hover:bg-neutral-800/50"
        >
          <div class="mb-2 flex items-start justify-between">
            <div>
              <span
                class="me-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                :class="getDeliveryTypeClasses(delivery.isPrivateHome)"
              >
                {{ delivery.isPrivateHome ? "Premium" : "Standard" }}
              </span>

              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                :class="getDeliveryStatusClasses(delivery)"
              >
                {{ getDeliveryStatusText(delivery) }}
              </span>
            </div>

            <span
              class="font-mono text-lg font-bold"
              :class="getTimeColorClass(delivery)"
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
                {{ delivery.deliveryPoint.name || "Customer #" + delivery.id }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery detail view -->
      <div
        v-if="selectedDelivery"
        class="p-4"
      >
        <!-- Timer section -->
        <div class="mb-6 text-center">
          <div class="mb-1 text-sm text-neutral-400">Time Remaining</div>
          <div
            class="font-mono text-4xl font-bold"
            :class="getTimeColorClass(selectedDelivery)"
          >
            {{ formatTime(remainingTime) }}
          </div>

          <!-- Progress bar -->
          <div class="mt-3 h-3 overflow-hidden rounded-full bg-neutral-800">
            <div
              class="h-full transition-all duration-200"
              :class="getTimeColorClass(selectedDelivery)"
              :style="{
                width: `${(remainingTime / selectedDelivery.timeLimit) * 100}%`,
              }"
            ></div>
          </div>
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
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                :class="
                  selectedDelivery.isCollected
                    ? 'bg-green-800 text-green-100'
                    : 'bg-amber-800 text-amber-100'
                "
              >
                {{ selectedDelivery.isCollected ? "Collected" : "Needs Pickup" }}
              </span>
            </div>

            <div class="text-sm text-white">Restaurant #{{ selectedDelivery.id }}</div>
            <div class="mt-1 text-xs text-neutral-400">
              Coordinates: {{ selectedDelivery.collectionPoint.x.toFixed(0) }},
              {{ selectedDelivery.collectionPoint.y.toFixed(0) }},
              {{ selectedDelivery.collectionPoint.z.toFixed(0) }}
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
                :class="getDeliveryTypeClasses(selectedDelivery.isPrivateHome)"
              >
                {{ selectedDelivery.isPrivateHome ? "Premium" : "Standard" }}
              </span>
            </div>

            <div class="text-sm text-white">
              {{ selectedDelivery.deliveryPoint.name || "Customer #" + selectedDelivery.id }}
            </div>
            <div class="mt-1 text-xs text-neutral-400">
              Coordinates: {{ selectedDelivery.deliveryPoint.x.toFixed(0) }},
              {{ selectedDelivery.deliveryPoint.y.toFixed(0) }},
              {{ selectedDelivery.deliveryPoint.z.toFixed(0) }}
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
                <div class="text-sm text-white">$100</div>
              </div>

              <div>
                <div class="text-xs text-neutral-400">Time Bonus</div>
                <div class="text-sm text-white">+${{ selectedDelivery.bonus }}</div>
              </div>

              <div v-if="selectedDelivery.isPrivateHome">
                <div class="text-xs text-neutral-400">Premium Bonus</div>
                <div class="text-sm text-white">+20%</div>
              </div>

              <div>
                <div class="text-xs text-neutral-400">XP</div>
                <div class="text-sm text-white">+10 XP</div>
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
              <div class="absolute bottom-0 left-4 top-0 w-0.5 bg-neutral-700"></div>

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
                    {{ new Date(selectedDelivery.startTime).toLocaleTimeString() }}
                  </p>
                </div>
              </div>

              <div class="relative mb-6 flex items-start">
                <div
                  class="z-10 flex h-8 w-8 items-center justify-center rounded-full"
                  :class="
                    selectedDelivery.isCollected
                      ? 'bg-green-800 text-green-100'
                      : 'bg-amber-800 text-amber-100'
                  "
                >
                  <Icon
                    :name="selectedDelivery.isCollected ? 'mdi:check' : 'mdi:food'"
                    class="w-5"
                  />
                </div>
                <div class="ml-4 pt-1">
                  <h4 class="font-medium text-white">Food Pickup</h4>
                  <p class="text-xs text-neutral-400">
                    {{ selectedDelivery.isCollected ? "Completed" : "In Progress" }}
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
      </div>

      <!-- Stats view -->
      <div
        v-if="showStats && !selectedDelivery"
        class="p-4"
      >
        <div class="mb-6 text-center">
          <div class="mb-1 text-sm text-neutral-400">Delivery Level</div>
          <div class="text-3xl font-bold text-white">5</div>

          <!-- XP Progress bar -->
          <div class="mt-3 h-3 overflow-hidden rounded-full bg-neutral-800">
            <div class="h-full w-3/4 bg-blue-500"></div>
          </div>
          <div class="mt-1 text-xs text-neutral-400">750 / 1000 XP</div>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-4">
          <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-3 text-center">
            <div class="mb-1 text-sm text-neutral-400">Total Deliveries</div>
            <div class="text-xl font-bold text-white">42</div>
          </div>

          <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-3 text-center">
            <div class="mb-1 text-sm text-neutral-400">Success Rate</div>
            <div class="text-xl font-bold text-green-500">89%</div>
          </div>

          <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-3 text-center">
            <div class="mb-1 text-sm text-neutral-400">Premium Rate</div>
            <div class="text-xl font-bold text-violet-500">15%</div>
          </div>

          <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-3 text-center">
            <div class="mb-1 text-sm text-neutral-400">Avg. Tip</div>
            <div class="text-xl font-bold text-yellow-500">$15</div>
          </div>
        </div>

        <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-4">
          <h4 class="mb-3 font-medium text-white">Level Perks</h4>

          <div class="space-y-2">
            <div class="flex items-center">
              <Icon
                name="mdi:check"
                class="mr-2 w-5 text-green-500"
              />
              <span class="text-sm text-white">0.5 min faster deliveries</span>
            </div>
            <div class="flex items-center">
              <Icon
                name="mdi:check"
                class="mr-2 w-5 text-green-500"
              />
              <span class="text-sm text-white">15% premium delivery chance</span>
            </div>
            <div class="flex items-center">
              <Icon
                name="mdi:check"
                class="mr-2 w-5 text-green-500"
              />
              <span class="text-sm text-white">Up to 3 concurrent deliveries</span>
            </div>
            <div class="flex items-center opacity-50">
              <Icon
                name="mdi:lock"
                class="mr-2 w-5 text-yellow-500"
              />
              <span class="text-sm text-white">20% premium delivery chance (Level 10)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.bg-neutral-850 {
  background-color: #1a1a1a;
}
</style>
