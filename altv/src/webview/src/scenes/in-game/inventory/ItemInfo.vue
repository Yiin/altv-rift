<script setup lang="ts">
import { computed } from "vue";
import {
  CombineType,
  getCombineType,
  getItemName,
  isItemClothing,
  isUnisexClothing,
  isFemaleClothing,
  getWeaponStats,
  isItemFirearmWeapon,
  isItemFishingRod,
  isItemWeapon,
  getWeaponDamage,
} from "@shared/modules/items";
import { useItemDetails } from "@/composables/use-item-details";
import { type Hovering, getSelectedItem } from "@/store/inventory";
import { getRandomDescription } from "@/lib/utils";
import { useFloatingStyles } from "@/composables/use-floating-styles";
import Icon from "@/components/Icon/Icon.vue";

const props = defineProps<Hovering>();

const item = computed(() => props.item.item);

const price = computed(() => {
  if (props.item && "price" in props.item) {
    return props.item.price;
  }
  return null;
});

const details = useItemDetails(item);

const weaponStats = computed(() => {
  if (isItemWeapon(item.value)) {
    return {
      ...getWeaponStats(item.value.key),
      damage: getWeaponDamage(item.value.key, item.value.grade),
    };
  }
  return null;
});

const combination = computed(() => {
  const selectedItem = getSelectedItem();

  if (!selectedItem) {
    return null;
  }
  const target = item.value.key;
  const source = selectedItem.item.key;

  const [combineType, reverse] = getCombineType(target, source);

  switch (combineType) {
    case CombineType.EquipAmmo:
      const [ammo, weapon] = reverse ? [target, source] : [source, target];
      return `Click to load ${getItemName(weapon)} with ${getItemName(ammo)}`;
    case CombineType.EquipFishingBait:
      const [bait, rod] = reverse ? [target, source] : [source, target];
      return `Click to use ${getItemName(bait)} for ${getItemName(rod)}`;
  }

  return null;
});

const { floatingStyles, floatingRef } = useFloatingStyles(props.position);
</script>

<template>
  <div
    ref="floatingRef"
    class="pointer-events-none z-max mx-auto w-72 select-none bg-white p-4 text-black"
    :style="floatingStyles"
  >
    <div
      v-if="combination"
      class="mb-2 font-bold text-yellow-500"
    >
      {{ combination }}
    </div>

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
          {{ details.customName ?? details.name }}
        </div>

        <!-- 
          Shop price
        -->
        <div
          v-if="typeof price === 'number'"
          class="text-xl font-bold text-yellow-300"
        >
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
        <Icon name="mdi:rename-outline" />
        <div class="font-bold">
          {{ details.name }}
        </div>
      </div>

      <!--
        Firearm weapon info
      -->
      <div
        v-if="isItemFirearmWeapon(item) && item.clip"
        class="mt-2 flex items-center gap-2"
      >
        <Icon name="mdi:ammunition" />
        <div>
          <div class="font-bold">
            {{ getItemName(item.clip.key) }}
          </div>
          <div class="flex items-baseline">
            <Icon
              name="mdi:close"
              class="w-3"
            />
            <div class="-mt-1 font-bold text-yellow-500">
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
        <Icon name="mdi:chart-bubble" />
        <div>
          <div class="font-bold">
            {{ getItemName(item.bait.key) }}
          </div>
          <div class="flex items-baseline gap-1">
            <Icon
              name="mdi:close"
              class="w-3"
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
