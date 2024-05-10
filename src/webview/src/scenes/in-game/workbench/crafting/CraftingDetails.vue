<script setup lang="ts">
import { computed } from "vue";
import { getItemName, getItemDescription } from "@shared/modules/items";
import { hasMatchingPart } from "@shared/modules/production";
import { useCharacter } from "@/store/synced/character.store";
import { useQuantity } from "@/composables/use-quantity";
import ItemIcon from "../../inventory/ItemIcon.vue";
import WorkbenchSlot from "../components/WorkbenchSlot.vue";
import { useCrafting } from "../composables/use-crafting";

const {
  queue,
  selectedRecipe,
  onStartCrafting,
  cancelCrafting,
  removeFromQueue,
  canCraftSelectedRecipe,
} = useCrafting();

const character = useCharacter();
const { quantity, handleQuantityInput, handleQuantityKeydown, handleQuantityPaste } = useQuantity();

const isInQueue = computed(() => queue.value.includes(selectedRecipe.value));
const isCurrentlyBeingCrafted = computed(() => queue.value[0] === selectedRecipe.value);
</script>

<template>
  <div class="flex flex-col items-end text-right">
    <template v-if="selectedRecipe">
      <div class="-mb-1 text-3xl font-bold">{{ getItemName(selectedRecipe.item.key) }}</div>
      <div class="text-xl font-medium text-gray-500">Crafting recipe</div>
      <div class="mt-4 max-w-56.25 text-right text-white">
        {{ getItemDescription(selectedRecipe.item.key) }}
      </div>
      <div class="mb-12 mt-5 flex flex-wrap items-center justify-end gap-2">
        <WorkbenchSlot
          v-for="(part, index) in selectedRecipe.parts"
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
          <div class="absolute left-2.5 top-2.5 max-w-24 text-left text-sm text-white">
            {{ getItemName(part.key) }}
          </div>
        </WorkbenchSlot>
      </div>
      <div class="mb-18.75 flex w-56.25 flex-grow flex-col justify-end">
        <div class="mb-4 text-xl font-bold">Crafting information</div>
        <div class="mb-4 flex justify-end gap-2">
          <div
            class="rounded-md border border-solid border-neutral-400/10 bg-neutral-400/5 px-3.25 py-2.75"
          >
            <div class="whitespace-nowrap text-right text-xs font-bold uppercase text-neutral-400">
              Crafting time
            </div>
            <div class="text-right text-xl font-bold text-white">
              {{ selectedRecipe.durationSeconds }} s
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-between rounded-md border border-solid border-neutral-400/10 bg-neutral-400/5 p-4"
          :class="[isInQueue ? 'invisible' : 'visible']"
        >
          <div
            @click="quantity--"
            class="-mt-1 cursor-pointer px-4 text-3xl leading-[0]"
            :class="[quantity === 1 ? 'text-gray-500' : 'text-white']"
          >
            -
          </div>
          <input
            class="leading-0 block w-full border-none bg-none text-center text-xl focus-visible:outline-none"
            :value="quantity"
            @input="handleQuantityInput"
            @keydown="handleQuantityKeydown"
            @paste="handleQuantityPaste"
          />
          <div
            @click="quantity++"
            class="-mt-1 cursor-pointer px-4 text-3xl leading-[0]"
            :class="[quantity === 99 ? 'text-gray-500' : 'text-white']"
          >
            +
          </div>
        </div>
        <button
          v-if="isCurrentlyBeingCrafted"
          class="button mt-2.5 p-4 pt-3.5 text-center text-lg font-bold"
          @click="() => cancelCrafting()"
        >
          Cancel crafting
        </button>
        <button
          v-else-if="isInQueue"
          class="button mt-2.5 p-4 pt-3.5 text-center text-lg font-bold"
          @click="() => removeFromQueue()"
        >
          Remove from queue
        </button>
        <button
          v-else
          class="button mt-2.5 p-4 pt-3.5 text-center text-lg font-bold"
          @click="() => onStartCrafting(quantity)"
          :disabled="!canCraftSelectedRecipe"
        >
          Begin crafting
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
../../../../composables/use-quantity
