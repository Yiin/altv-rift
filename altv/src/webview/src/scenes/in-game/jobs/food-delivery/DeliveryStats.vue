<script setup lang="ts">
import { computed } from "vue";
import { getLevel, getMissingExperience } from "@shared/modules/experience/experience-table";
import Icon from "@/components/Icon/Icon.vue";

const props = defineProps<{
  characterSkills: {
    foodDelivery: {
      exp: number;
      stats: {
        totalDeliveries: number;
        failedDeliveries: number;
        privateHomeDeliveries: number;
        tipsReceived: number;
      };
    };
  };
}>();

// Calculate success rate
const successRate = computed(() => {
  if (!props.characterSkills.foodDelivery.stats.totalDeliveries) return 0;

  return (
    (props.characterSkills.foodDelivery.stats.totalDeliveries -
      props.characterSkills.foodDelivery.stats.failedDeliveries) /
    props.characterSkills.foodDelivery.stats.totalDeliveries
  ).toFixed(1);
});

// Calculate premium rate
const premiumRate = computed(() => {
  if (!props.characterSkills.foodDelivery.stats.totalDeliveries) return 0;

  return (
    props.characterSkills.foodDelivery.stats.privateHomeDeliveries /
    props.characterSkills.foodDelivery.stats.totalDeliveries
  ).toFixed(1);
});

// Calculate average tip
const averageTip = computed(() => {
  if (!props.characterSkills.foodDelivery.stats.totalDeliveries) return 0;

  return Math.round(
    props.characterSkills.foodDelivery.stats.tipsReceived /
      props.characterSkills.foodDelivery.stats.totalDeliveries,
  );
});
</script>

<template>
  <div class="p-4">
    <div class="mb-6 text-center">
      <div class="mb-1 text-sm text-neutral-400">Delivery Level</div>
      <div class="text-3xl font-bold text-white">
        {{ getLevel(characterSkills.foodDelivery.exp) }}
      </div>

      <!-- XP Progress bar -->
      <div class="mt-3 h-3 overflow-hidden rounded-full bg-neutral-800">
        <div class="h-full w-3/4 bg-blue-500"></div>
      </div>
      <div class="mt-1 text-xs text-neutral-400">
        {{ characterSkills.foodDelivery.exp }} /
        {{
          characterSkills.foodDelivery.exp + getMissingExperience(characterSkills.foodDelivery.exp)
        }}
        XP
      </div>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4">
      <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-3 text-center">
        <div class="mb-1 text-sm text-neutral-400">Total Deliveries</div>
        <div class="text-xl font-bold text-white">
          {{ characterSkills.foodDelivery.stats.totalDeliveries }}
        </div>
      </div>

      <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-3 text-center">
        <div class="mb-1 text-sm text-neutral-400">Success Rate</div>
        <div class="text-xl font-bold text-green-500">{{ successRate }}%</div>
      </div>

      <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-3 text-center">
        <div class="mb-1 text-sm text-neutral-400">Premium Rate</div>
        <div class="text-xl font-bold text-violet-500">{{ premiumRate }}%</div>
      </div>

      <div class="bg-neutral-850 rounded-lg border border-neutral-800 p-3 text-center">
        <div class="mb-1 text-sm text-neutral-400">Avg. Tip</div>
        <div class="text-xl font-bold text-yellow-500">${{ averageTip }}</div>
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
</template>
