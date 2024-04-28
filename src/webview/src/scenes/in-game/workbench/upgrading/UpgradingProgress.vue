<script setup lang="ts">
import { computed, ref } from "vue";
import {
  getItemName,
  getWeaponStats,
  isItemWeapon,
  getWeaponDamage,
  isItemKeyAmmo,
  isItemKeyThrowableWeapon,
} from "@shared/modules/items";
import { getItemImage } from "@/utils/items";
import { useFrame } from "@/composables/use-frame";
import WorkbenchSlot from "../components/WorkbenchSlot.vue";
import ItemBadge from "../components/ItemBadge.vue";
import { useUpgrading } from "../composables/use-upgrading";

const { hasRecipes, selectedItem, upgradeRecipe, currentlyUpgrading } = useUpgrading();

const now = ref(Date.now());

useFrame(() => {
  now.value = Date.now();
});

const upgradingProgress = computed(() => {
  if (!currentlyUpgrading.value) return 0;

  const time = currentlyUpgrading.value.recipe.durationSeconds * 1000;
  const progress = Math.min(1, (now.value - currentlyUpgrading.value.startedAt) / time);

  return progress * 100;
});
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center text-center">
    <div class="invisible flex h-46.25 flex-col items-center" />
    <template v-if="selectedItem && upgradeRecipe">
      <div class="pointer-events-none">
        <div class="relative flex justify-center">
          <ItemBadge :grade="'grade' in upgradeRecipe.item ? upgradeRecipe.item.grade : 'none'" />
          <div
            class="absolute-center h-66.5 w-135 bg-contain bg-center"
            :class="{
              '-mt-4 scale-50':
                isItemKeyAmmo(upgradeRecipe.item.key) ||
                isItemKeyThrowableWeapon(upgradeRecipe.item.key),
            }"
            :style="{ backgroundImage: `url(${getItemImage(upgradeRecipe.item.key)})` }"
          />
        </div>
      </div>
      <div class="my-10 flex justify-center">
        <img
          :src="`./assets/workbench/ornament.svg`"
          class="align-self-center h-3 w-18.5"
        />
      </div>
      <div class="-mt-4 mb-8 text-3xl font-bold">{{ getItemName(upgradeRecipe.item.key) }}</div>
      <div
        v-if="isItemWeapon(upgradeRecipe.item)"
        class="flex justify-center gap-3.5"
      >
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{ (getWeaponStats(upgradeRecipe.item.key).timeBetweenShots * 60).toFixed(2) }}
          </h3>
          <div class="font-light">Fire rate</div>
        </WorkbenchSlot>
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{ getWeaponStats(upgradeRecipe.item.key).accuracySpread.toFixed(2) }}
          </h3>
          <div class="font-light">Accuracy</div>
        </WorkbenchSlot>
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3
            class="text-3xl font-bold text-yellow-500 drop-shadow-glow-color"
            :style="{ '--glow-color': 'rgb(234 179 8 / 0.5)' }"
          >
            {{ getWeaponDamage(upgradeRecipe.item.key, upgradeRecipe.item.grade) }}
          </h3>
          <div class="font-light">Damage</div>
        </WorkbenchSlot>
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{ getWeaponStats(upgradeRecipe.item.key).clipSize }}
          </h3>
          <div class="font-light">Clip</div>
        </WorkbenchSlot>
      </div>
      <div class="flex w-full flex-grow flex-col items-center justify-end">
        <template v-if="currentlyUpgrading">
          <div class="h-1 w-full rounded bg-neutral-500/20">
            <div
              class="h-1 rounded bg-white"
              :style="{ width: `${upgradingProgress}%` }"
            ></div>
          </div>
          <div class="text-grey mb-6 mt-3 text-base leading-none">
            Upgrading
            <span class="font-semibold text-white">
              {{ getItemName(currentlyUpgrading.recipe.item.key) }}
            </span>
          </div>
        </template>
      </div>
    </template>
    <template v-else-if="hasRecipes">
      <div class="flex flex-col items-center justify-center">
        <img
          :src="`./assets/workbench/upgrade-emblem.svg`"
          class="align-self-center h-29.5 w-29.5"
        />
        <div class="mt-10 text-center text-3xl font-bold leading-none text-white">
          Select an item to upgrade
        </div>
        <div class="text-center text-lg font-semibold text-zinc-600">
          To upgrade an item you need a blueprint recipe for it and enough materials.
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center justify-center">
        <img
          :src="`./assets/workbench/upgrade-emblem.svg`"
          class="align-self-center h-29.5 w-29.5"
        />
        <div class="mt-10 text-center text-3xl font-bold leading-none text-white">
          You currently have no items that you can upgrade.
        </div>
        <div class="text-center text-lg font-semibold text-zinc-600">
          To upgrade an item you need a blueprint recipe for it and enough materials.
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.test {
  --stroke-pos: 1px;
  --stroke-neg: -1px;
  --stroke-color: rgba(0, 255, 0, 0.2);
  filter: drop-shadow(var(--stroke-pos) 0 0 var(--stroke-color))
    drop-shadow(var(--stroke-neg) 0 var(--stroke-color))
    drop-shadow(0 var(--stroke-pos) 0 var(--stroke-color))
    drop-shadow(0 var(--stroke-neg) 0 var(--stroke-color))
    drop-shadow(var(--stroke-pos) var(--stroke-pos) 0 var(--stroke-color))
    drop-shadow(var(--stroke-pos) var(--stroke-neg) 0 var(--stroke-color))
    drop-shadow(var(--stroke-neg) var(--stroke-pos) 0 var(--stroke-color))
    drop-shadow(var(--stroke-neg) var(--stroke-neg) 0 var(--stroke-color));
}
</style>
