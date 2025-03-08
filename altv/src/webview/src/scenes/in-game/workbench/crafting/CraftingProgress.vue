<script setup lang="ts">
import { computed, ref } from "vue";
import {
  getAmmoDamageMultiplier,
  getItemName,
  getWeaponStats,
  isItemAmmo,
  isItemKeyAmmo,
  isItemFirearmWeapon,
  isItemKeyThrowableWeapon,
  getWeaponDamage,
} from "@shared/modules/items";
import { getItemImage } from "@/lib/utils";
import { useFrame } from "@/composables/use-frame";
import { asset } from "@/lib/utils";
import Image from "@/components/Image.vue";
import ItemIcon from "../../inventory/ItemIcon.vue";
import WorkbenchSlot from "../components/WorkbenchSlot.vue";
import ItemBadge from "../components/ItemBadge.vue";
import { useCrafting } from "../composables/use-crafting";

const { hasRecipes, queue, selectedRecipe, startedCraftingAt } = useCrafting();

const now = ref(Date.now());

useFrame(() => {
  now.value = Date.now();
});

const craftingProgress = computed(() => {
  if (!currentlyCrafting.value) return 0;

  const time = currentlyCrafting.value.durationSeconds * 1000;
  const progress = Math.min(1, (now.value - startedCraftingAt.value) / time);

  return progress * 100;
});

const currentlyCrafting = computed(() => queue.value[0]);
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center text-center">
    <template v-if="selectedRecipe">
      <div
        class="flex h-46.25 flex-col items-center"
        :class="[queue.length > 0 ? 'visible' : 'invisible']"
      >
        <div class="text-lg font-bold leading-tight">In queue</div>
        <div class="my-2 mb-3.75 flex justify-center">
          <Image
            :src="asset(`assets/workbench/long-separator.svg`)"
            class="align-self-center h-5.25 w-139.5"
          />
        </div>
        <div
          class="align-center scrollbar-horizontal scrollbar-red mb-7 flex max-w-147.5 gap-1.25 overflow-x-auto overflow-y-hidden pb-4"
        >
          <WorkbenchSlot
            v-for="(item, i) in queue"
            :key="i"
            class="h-18.75 w-18.75"
            :class="[i === 1 && 'ml-2']"
            v-horizontal-scroll
            @click="selectedRecipe = item"
            :selected="selectedRecipe === item"
          >
            <ItemIcon :item="item.item" />
          </WorkbenchSlot>
        </div>
      </div>
      <div class="pointer-events-none">
        <div class="flex justify-center">
          <ItemBadge :grade="'grade' in selectedRecipe.item ? selectedRecipe.item.grade : 'none'" />
          <Image
            class="absolute h-66.5 w-135"
            :class="{
              '-mt-4 scale-50':
                isItemKeyAmmo(selectedRecipe.item.key) ||
                isItemKeyThrowableWeapon(selectedRecipe.item.key),
            }"
            :src="getItemImage(selectedRecipe.item.key)"
          />
        </div>
      </div>
      <div class="my-10 flex justify-center">
        <Image
          :src="asset(`assets/workbench/ornament.svg`)"
          class="align-self-center h-3 w-18.5"
        />
      </div>
      <div class="-mt-4 mb-8 text-3xl font-bold">{{ getItemName(selectedRecipe.item.key) }}</div>
      <div
        v-if="isItemFirearmWeapon(selectedRecipe.item)"
        class="flex justify-center gap-3.5"
      >
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{
              (getWeaponStats(selectedRecipe.item.key).timeBetweenShots * 60)
                .toFixed(2)
                .replace(/0+$/g, "")
                .replace(/\.$/g, "")
            }}
          </h3>
          <div class="font-light">Fire rate</div>
        </WorkbenchSlot>
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{ getWeaponStats(selectedRecipe.item.key).accuracySpread.toFixed(2) }}
          </h3>
          <div class="font-light">Accuracy</div>
        </WorkbenchSlot>
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{ getWeaponDamage(selectedRecipe.item.key, selectedRecipe.item.grade) }}
          </h3>
          <div class="font-light">Damage</div>
        </WorkbenchSlot>
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          v-if="getWeaponStats(selectedRecipe.item.key).clipSize"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{ getWeaponStats(selectedRecipe.item.key).clipSize }}
          </h3>
          <div class="font-light">Clip</div>
        </WorkbenchSlot>
      </div>
      <div
        v-else-if="isItemAmmo(selectedRecipe.item)"
        class="flex justify-center gap-3.5"
      >
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          v-if="getAmmoDamageMultiplier(selectedRecipe.item.key, selectedRecipe.item.grade)"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            <span class="text-lg">x</span>
            {{ getAmmoDamageMultiplier(selectedRecipe.item.key, selectedRecipe.item.grade) }}
          </h3>
          <div class="font-light">Dmg</div>
        </WorkbenchSlot>
      </div>
      <div class="flex w-full grow flex-col items-center justify-end">
        <template v-if="currentlyCrafting">
          <div class="h-1 w-full rounded bg-neutral-500/20">
            <div
              class="h-1 rounded bg-white"
              :style="{ width: `${craftingProgress}%` }"
            ></div>
          </div>
          <div class="text-grey mb-6 mt-3 text-base leading-none">
            Crafting
            <span class="font-semibold text-white">
              {{ getItemName(currentlyCrafting.item.key) }}
            </span>
          </div>
        </template>
      </div>
    </template>
    <template v-else-if="hasRecipes">
      <div class="flex flex-col items-center justify-center">
        <Image
          :src="asset(`assets/workbench/crafting-emblem.svg`)"
          class="align-self-center h-29.5 w-29.5"
        />
        <div class="mt-10 text-center text-3xl font-bold leading-none text-white">
          Select a recipe to craft
        </div>
        <div class="text-center text-lg font-semibold text-zinc-600">
          Blueprints contain recipes you can use for crafting.
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center justify-center">
        <Image
          :src="asset(`assets/workbench/crafting-emblem.svg`)"
          class="align-self-center h-29.5 w-29.5"
        />
        <div class="mt-10 text-center text-3xl font-bold leading-none text-white">
          You currently have no blueprints.
        </div>
        <div class="text-center text-lg font-semibold text-zinc-600">
          Blueprints contain recipes you can use for crafting.
        </div>
      </div>
    </template>
  </div>
</template>
