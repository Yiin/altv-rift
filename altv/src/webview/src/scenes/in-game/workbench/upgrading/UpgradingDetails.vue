<script setup lang="ts">
import { getItemName, getItemDescription, ItemGrade } from "@shared/modules/items";
import { hasMatchingPart } from "@shared/modules/production";
import { useCharacter } from "@/store/synced/character.store";
import ItemIcon from "../../inventory/ItemIcon.vue";
import WorkbenchSlot from "../components/WorkbenchSlot.vue";
import { useUpgrading } from "../composables/use-upgrading";

const {
  selectedItem,
  upgradeRecipe,
  currentlyUpgrading,
  onStartUpgrading,
  cancelUpgrading,
  canUpgradeSelectedItem,
} = useUpgrading();

const character = useCharacter();
</script>

<template>
  <div class="flex flex-col items-end text-right">
    <template v-if="selectedItem && upgradeRecipe">
      <div class="-mb-1 text-3xl font-bold">{{ getItemName(selectedItem.key) }}</div>
      <div class="text-xl font-medium text-gray-500">Crafting recipe</div>
      <div class="mt-4 max-w-56.25 text-right text-white">
        {{ getItemDescription(selectedItem.key) }}
      </div>
      <div class="mb-12 mt-5 flex flex-wrap items-center justify-end gap-2">
        <WorkbenchSlot
          v-for="(part, index) in upgradeRecipe.parts"
          :key="`${part.key}-${index}`"
          class="relative h-28 w-28"
          :selected="false"
        >
          <ItemIcon
            class="mt-5"
            :class="{ 'opacity-50': !hasMatchingPart(part, character.inventory) }"
            :item="part"
            width="4.45rem"
            height="4.45rem"
          />
          <div
            v-if="'grade' in part"
            class="absolute bottom-2.5 left-2.5 rounded-md px-1 text-xs font-bold uppercase"
            :class="[
              {
                [ItemGrade.COMMON]: `text-common`,
                [ItemGrade.UNCOMMON]: `text-uncommon`,
                [ItemGrade.RARE]: `text-rare`,
                [ItemGrade.EPIC]: `text-epic`,
                [ItemGrade.LEGENDARY]: `text-legendary`,
                [ItemGrade.CONTRABAND]: `text-contraband`,
                [ItemGrade.LIMITED]: `text-limited`,
              }[part.grade],
            ]"
          >
            {{ part.grade }}
          </div>
          <div class="absolute left-2.5 top-2.5 max-w-24 text-left text-sm text-white">
            {{ getItemName(part.key) }}
          </div>
        </WorkbenchSlot>
      </div>
      <div class="mb-18.75 flex w-56.25 grow flex-col justify-end">
        <div class="mb-4 text-xl font-bold">Crafting information</div>
        <div class="mb-4 flex justify-end gap-2">
          <!-- <div
            class="rounded-md border border-solid border-neutral-400/10 bg-neutral-400/5 px-3.25 py-2.75"
          >
            <div class="whitespace-nowrap text-right text-xs font-bold uppercase text-neutral-400">
              Success rate
            </div>
            <div class="text-right text-xl font-bold text-amber-300">32%</div>
          </div> -->
          <div
            class="rounded-md border border-solid border-neutral-400/10 bg-neutral-400/5 px-3.25 py-2.75"
          >
            <div class="whitespace-nowrap text-right text-xs font-bold uppercase text-neutral-400">
              Crafting time
            </div>
            <div class="text-right text-xl font-bold text-white">
              {{ upgradeRecipe.durationSeconds }} s
            </div>
          </div>
        </div>
        <button
          v-if="currentlyUpgrading"
          class="button mt-2.5 p-4 pt-3.5 text-center text-lg font-bold"
          @click="() => cancelUpgrading()"
        >
          Cancel upgrading
        </button>
        <button
          v-else
          class="button mt-2.5 p-4 pt-3.5 text-center text-lg font-bold"
          @click="() => onStartUpgrading()"
          :disabled="!canUpgradeSelectedItem"
        >
          Upgrade
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.button {
  background: url("../../../../../public/assets/workbench/button-background.svg");
  background-size: contain;
}

.button:not(:disabled):hover {
  background: url("../../../../../public/assets/workbench/button-background-hovered.svg");
  background-size: contain;
}

.button:disabled {
  filter: grayscale(1);
}
</style>
