<script setup lang="ts">
import { computed, ref } from "vue";
import {
  type Item,
  getItemName,
  getWeaponStats,
  isItemFirearmWeapon,
  isItemFishingRod,
  isItemWeapon,
  isItemClothing,
  isUnisexClothing,
  isFemaleClothing,
} from "@shared/modules/items";
import { useItemDetails } from "@/composables/use-item-details";
import { getRandomDescription } from "@/lib/utils";
import { useEventListener } from "@/composables/use-event-listener";

const props = defineProps<{
  item: Item;
  actionText?: string;
}>();

const details = useItemDetails(props.item);

const weaponStats = computed(() => {
  if (isItemWeapon(props.item)) {
    return getWeaponStats(props.item.key);
  }
  return null;
});

const cursorPos = ref({ x: 0, y: 0 });
useEventListener("mousemove", (event: MouseEvent) => {
  cursorPos.value = { x: event.clientX, y: event.clientY };
});
</script>

<template>
  <div
    class="pointer-events-none absolute left-0 top-0 z-max mx-auto w-72 select-none bg-white p-4 text-black"
    theme="light"
    :style="{
      transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
    }"
  >
    <!-- 
      Name and description
     -->
    <div>
      <div class="mb-2 flex justify-between text-lg font-bold">
        <div class="flex gap-2">
          <div v-if="isItemClothing(item)">
            <span v-if="isUnisexClothing(item.key)">
              <span class="font-bold text-gray-500">U</span>
            </span>
            <span
              v-else-if="isFemaleClothing(item.key)"
              class="font-bold text-pink-400"
            >
              F
            </span>
            <span
              v-else
              class="font-bold text-gray-500"
            >
              M
            </span>
          </div>
          {{ details.name }}
        </div>
        <div v-if="'grade' in props.item">{{ props.item.grade }}</div>
      </div>
      <div class="text-sm">
        {{ details.description || getRandomDescription(details.name) }}
      </div>
      <div
        v-if="props.actionText"
        class="text-md mt-2 font-bold"
      >
        {{ props.actionText }}
      </div>
    </div>

    <div class="d-flex justify-space-between">
      <!-- 
        Custom name
       -->
      <div v-if="details.customName">
        <v-icon icon="mdi-rename-outline" />
        <div class="font-bold">
          {{ details.name }}
        </div>
      </div>

      <!--
        Firearm weapon info
      -->
      <div
        v-if="isItemFirearmWeapon(item) && item.clip"
        class="flex items-center gap-1"
      >
        <v-icon icon="mdi-ammunition" />
        <div>
          <div class="font-bold">
            {{ getItemName(item.clip.key) }}
          </div>
          <div class="flex items-baseline gap-1">
            <v-icon
              icon="mdi-close"
              size="12"
            />
            <div class="font-bold text-yellow-500">
              {{ item.clip.amount }}
            </div>
          </div>
        </div>
      </div>

      <!--
        Weapon stats
      -->
      <div
        v-if="weaponStats"
        class="mt-2 flex flex-col gap-1"
      >
        <div
          v-if="weaponStats.damage"
          class="align-center flex justify-between gap-2"
        >
          <div class="text-md font-bold">DPS</div>
          <div class="align-center flex w-1/2 gap-2">
            <div class="font-semibold">
              {{ (weaponStats.damage * (1 / weaponStats.timeBetweenShots)).toFixed(1) }}
            </div>
          </div>
        </div>
        <div
          v-if="weaponStats.damage"
          class="align-center flex justify-between gap-2"
        >
          <div class="text-md font-bold">Damage</div>
          <div class="align-center flex w-1/2 gap-2">
            <div class="font-semibold">
              {{ (weaponStats.damage * weaponStats.playerDamageModifier).toFixed(0) }}
            </div>
          </div>
        </div>
        <div class="align-center flex justify-between gap-2">
          <div class="text-md font-bold">Rate (per second)</div>
          <div class="align-center flex w-1/2 gap-2">
            <div class="font-semibold">
              {{
                (weaponStats.timeBetweenShots
                  ? 1 / weaponStats.timeBetweenShots
                  : 1 / weaponStats.animReloadRate
                ).toFixed(2)
              }}
            </div>
          </div>
        </div>
        <div
          v-if="weaponStats.accuracySpread"
          class="align-center flex justify-between gap-2"
        >
          <div class="text-md font-bold">Accuracy spread</div>
          <div class="align-center flex w-1/2 gap-2">
            <div class="font-semibold">
              {{ weaponStats.accuracySpread.toFixed(1).replace(".0", "") }}
            </div>
          </div>
        </div>
        <div class="align-center flex justify-between gap-2">
          <div class="text-md font-bold">Range</div>
          <div class="align-center flex w-1/2 gap-2">
            <div class="font-semibold">
              {{ weaponStats.range.toFixed(1).replace(".0", "") }}
            </div>
          </div>
        </div>
      </div>

      <!-- 
        Fishing rod info
       -->
      <div
        v-else-if="isItemFishingRod(item) && item.bait"
        class="flex items-center gap-1"
      >
        <v-icon icon="mdi-chart-bubble" />
        <div>
          <div class="font-bold">
            {{ getItemName(item.bait.key) }}
          </div>
          <div class="flex items-baseline gap-1">
            <v-icon
              icon="mdi-close"
              size="12"
            />
            <div class="font-bold text-yellow-500">
              {{ item.bait.amount }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
