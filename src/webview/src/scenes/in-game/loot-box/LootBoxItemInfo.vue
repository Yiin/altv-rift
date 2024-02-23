<script setup lang="ts">
import { computed, ref } from "vue";
import { useItemDetails } from "@/composables/use-item-details";
import { Item, getItemName, getWeaponStats, isItemFirearmWeapon, isItemFishingRod, isItemWeapon } from "@shared/modules/items";
import { getRandomDescription } from "@/utils/items";
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
  <div class="mx-auto absolute top-0 left-0 pointer-events-none select-none z-max w-72 bg-white text-black p-4"
    theme="light"
    :style="{
      transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
    }">
    <!-- 
      Name and description
     -->
    <div>
      <div class="text-lg font-bold mb-2 flex justify-between">
        <div>
          {{ details.name }}
        </div>
        <div v-if="'grade' in props.item">{{ props.item.grade }}</div>
      </div>
      <div class="text-sm">
        {{ details.description || getRandomDescription(details.name) }}
      </div>
      <div v-if="props.actionText" class="text-md font-bold mt-2">
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
      <div v-if="isItemFirearmWeapon(item) && item.ammo" class="flex items-center gap-1">
        <v-icon icon="mdi-ammunition" />
        <div>
          <div class="font-bold">
            {{ getItemName(item.ammo.key) }}
          </div>
          <div class="flex items-baseline gap-1">
            <v-icon icon="mdi-close" size="12" />
            <div class="font-bold text-yellow-500">
              {{ item.ammo.clip }}
              <span class="text-xs">/ {{ item.ammo.rest }}</span>
            </div>
          </div>
        </div>
      </div>

      <!--
        Weapon stats
      -->
      <div v-if="weaponStats" class="flex flex-col gap-1 mt-2">
        <div v-if="weaponStats.damage" class="flex align-center justify-between gap-2">
          <div class="text-md font-bold">
            DPS
          </div>
          <div class="flex align-center gap-2 w-1/2">
            <div class="font-semibold">
              {{ (weaponStats.damage * (1 / weaponStats.timeBetweenShots)).toFixed(1) }}
            </div>
          </div>
        </div>
        <div v-if="weaponStats.damage" class="flex align-center justify-between gap-2">
          <div class="text-md font-bold">
            Damage
          </div>
          <div class="flex align-center gap-2 w-1/2">
            <div class="font-semibold">
              {{ (weaponStats.damage * weaponStats.playerDamageModifier).toFixed(0) }}
            </div>
          </div>
        </div>
        <div class="flex align-center justify-between gap-2">
          <div class="text-md font-bold">
            Rate (per second)
          </div>
          <div class="flex align-center gap-2 w-1/2">
            <div class="font-semibold">
              {{ (weaponStats.timeBetweenShots ? (1 / weaponStats.timeBetweenShots) : (1 /
                weaponStats.animReloadRate)).toFixed(2) }}
            </div>
          </div>
        </div>
        <div v-if="weaponStats.accuracySpread" class="flex align-center justify-between gap-2">
          <div class="text-md font-bold">
            Accuracy spread
          </div>
          <div class="flex align-center gap-2 w-1/2">
            <div class="font-semibold">
              {{ weaponStats.accuracySpread.toFixed(1).replace('.0', '') }}
            </div>
          </div>
        </div>
        <div class="flex align-center justify-between gap-2">
          <div class="text-md font-bold">
            Range
          </div>
          <div class="flex align-center gap-2 w-1/2">
            <div class="font-semibold">
              {{ weaponStats.range.toFixed(1).replace('.0', '') }}
            </div>
          </div>
        </div>
      </div>

      <!-- 
        Fishing rod info
       -->
      <div v-else-if="isItemFishingRod(item) && item.bait" class="flex items-center gap-1">
        <v-icon icon="mdi-chart-bubble" />
        <div>
          <div class="font-bold">
            {{ getItemName(item.bait.key) }}
          </div>
          <div class="flex items-baseline gap-1">
            <v-icon icon="mdi-close" size="12" />
            <div class="font-bold text-yellow-500">
              {{ item.bait.amount }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
