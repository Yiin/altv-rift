<script setup lang="ts">
import { computed } from "vue";
import { useItemDetails } from "@/composables/use-item-details";
import { CombineType, getCombineType, getItemName, isItemFirearmWeapon, isItemFishingRod } from "@shared/modules/items";
import { Hovering, useInventory } from "@/store/inventory.store";
import { getRandomDescription } from "@/utils/items";

const props = defineProps<Hovering>();

const inventory = useInventory();

const item = computed(() => props.item.item);
const price = computed(() => {
  const item = inventory.getItemFromSource(props.item.source);

  if (item && 'price' in item) {
    return item.price;
  }
  return null;
});

const details = useItemDetails(item);

const combination = computed(() => {
  if (!inventory.selectedItem) {
    return null;
  }
  const target = item.value.key;
  const source = inventory.selectedItem.item.key;

  const [combineType, reverse] = getCombineType(target, source);

  switch (combineType) {
    case CombineType.EquipAmmo:
      const [ammo, weapon] = reverse ? [target, source] : [source, target];
      return `Click to load ${getItemName(weapon)} with ${getItemName(ammo)}`;
    case CombineType.EquipFishBait:
      const [bait, rod] = reverse ? [target, source] : [source, target];
      return `Click to use ${getItemName(bait)} for ${getItemName(rod)}`;
  }

  return null;
});
</script>

<template>
  <div class="mx-auto absolute top-0 left-0 pointer-events-none select-none z-max w-72 bg-neutral-950/70 text-white p-4"
    theme="light"
    :style="{
      transform: `translate(${position.x}px, ${position.y}px)`,
    }">
    <div v-if="combination" class="text-yellow-500 font-bold mb-2">
      {{ combination }}
    </div>

    <!-- 
      Name and description
     -->
    <div>
      <div class="text-lg font-bold mb-2 flex justify-between">
        {{ details.customName ?? details.name }}

        <!-- 
          Shop price
        -->
        <div v-if="typeof price === 'number'" class="text-xl font-bold text-yellow-300">
          €{{ price }}
        </div>
      </div>
      <div class="text-sm">
        {{ details.description || getRandomDescription(details.name) }}
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
