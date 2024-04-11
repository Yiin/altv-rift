<script setup lang="ts">
import { computed } from "vue";
import { getItemName, getWeaponStats, isItemKeyWeapon } from "@shared/modules/items";
import { getItemImage } from "@/utils/items";
import { px } from "@/composables/use-pixel";
import ItemIcon from "../../inventory/ItemIcon.vue";
import WorkbenchSlot from "../components/WorkbenchSlot.vue";
import { useCrafting } from "../composables/use-crafting";

const { hasRecipes, queue, selectedRecipe } = useCrafting();

const currentlyCrafting = computed(() => queue[0]);
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
          <img
            :src="`./assets/workbench/long-separator.svg`"
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
      <div>
        <div class="flex justify-center">
          <img
            :src="`./assets/workbench/weapon-ornament.svg`"
            class="align-self-center h-69.5 w-48.75"
          />
          <v-img
            class="absolute h-66.5 w-135"
            :src="getItemImage(selectedRecipe.item.key)"
          />
        </div>
      </div>
      <div class="my-10 flex justify-center">
        <img
          :src="`./assets/workbench/ornament.svg`"
          class="align-self-center h-3 w-18.5"
        />
      </div>
      <div
        v-if="isItemKeyWeapon(selectedRecipe.item.key)"
        class="flex justify-center gap-3.5"
      >
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{ (getWeaponStats(selectedRecipe.item.key).timeBetweenShots * 60).toFixed(2) }}
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
            {{ getWeaponStats(selectedRecipe.item.key).damage }}
          </h3>
          <div class="font-light">Damage</div>
        </WorkbenchSlot>
        <WorkbenchSlot
          class="h-22.5 w-22.5 flex-col"
          static
        >
          <h3 class="text-3xl font-bold text-red-500">
            {{ getWeaponStats(selectedRecipe.item.key).clipSize }}
          </h3>
          <div class="font-light">Clip</div>
        </WorkbenchSlot>
      </div>
      <div class="flex w-full flex-grow flex-col justify-end">
        <template v-if="currentlyCrafting">
          <v-progress-linear
            :height="px(4)"
            model-value="20"
            rounded-bar
            rounded
          />
          <div class="text-grey mb-6 mt-3 text-base leading-none">
            Now is crafting
            <span class="font-semibold text-white">
              {{ getItemName(currentlyCrafting.item.key) }}
            </span>
          </div>
        </template>
      </div>
    </template>
    <template v-else-if="hasRecipes">
      <div class="flex flex-col items-center justify-center">
        <img
          :src="`./assets/workbench/crafting-emblem.svg`"
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
        <img
          :src="`./assets/workbench/crafting-emblem.svg`"
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
