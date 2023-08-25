<script setup lang="ts">
import { computed } from "vue";
import { useItemDetails } from "@/composables/use-item-details";
import { CombineType, getCombineType, getItemName } from "@shared/modules/items";
import { Hovering, useInventory } from "@/store/inventory.store";

const props = defineProps<Hovering>();

const inventory = useInventory();

const item = computed(() => props.item.item);

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
  }

  return null;
});
</script>

<template>
  <div
    class="mx-auto absolute pointer-events-none select-none z-max w-72 bg-gray-950/80 text-white p-4"
    theme="light"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
  >
    <div v-if="combination" class="text-yellow-500 font-bold mb-2">
      {{ combination }}
    </div>
    <div>
      <div class="text-lg font-bold mb-2">{{ details.customName ?? details.name }}</div>
      <div class="text-sm">
        {{ details.description }}
      </div>
    </div>

    <div class="d-flex py-3 justify-space-between">
      <div v-if="details.customName">
        <v-icon icon="mdi-rename-outline" />
        <div class="font-bold">
          {{ details.name }}
        </div>
      </div>

      <div v-if="details.equipedAmmo" class="flex items-center gap-1">
        <v-icon icon="mdi-ammunition" />
        <div class="flex items-end gap-1">
          <div class="font-bold">
            {{ getItemName(details.equipedAmmo.key) }}
          </div>
          <div>
            <v-icon icon="mdi-close" size="12" />
          </div>
          <div class="font-bold text-yellow-500">
            {{ details.equipedAmmo.clip }} / {{ details.equipedAmmo.rest }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
