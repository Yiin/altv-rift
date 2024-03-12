<script setup lang="ts">
import { ref, computed } from "vue";
import { TransferingAmount, useInventory } from "@/store/inventory.store";
import { getItemImage } from "@/utils/items";
import { getItemName, isStackable } from "@shared/modules/items";
import { ItemSourceOrigin } from "@shared/interfaces";

const props = defineProps<TransferingAmount>();

const inventory = useInventory();
const amount = ref(1);

const itemName = computed(() => getItemName(props.item.item.key));
</script>

<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-max rounded-lg bg-neutral-900 text-white p-8 shadow-2xl min-w-64">
    <div>
      <div>
        <v-img
          class="drop-shadow-md flex-grow-0 my-5"
          width="10rem"
          :src="getItemImage(item.item.key)" />
        <h2 class="text-lg font-bold">
          {{ to && to.origin !== ItemSourceOrigin.Ground ? "You're moving" : "You're dropping" }} <br><span
            class="text-red-500">{{ itemName }}</span>
        </h2>

        <div
          v-if="isStackable(item.item)"
          class="relative w-full mt-2 pt-1 pb-3 mb-6 border-y-1 border-neutral-700">
          <div class="space-y-4">
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="amount">
                Amount
              </label>
              <div class="flex align-center gap-2">
                <input
                  v-model="amount"
                  class="flex font-bold h-10 w-28 rounded-md border border-input bg-neutral-700 px-3 py-2 pt-1 text-md leading-[0] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter amount"
                  type="number" />
              </div>
            </div>
            <div class="flex justify-between gap-2">
              <button
                @click="amount += 1"
                type="button"
                class="inline-flex items-center justify-center bg-neutral-800 rounded-md text-sm font-medium transition-colors border border-input hover:bg-neutral-700 hover:text-accent-foreground px-2 py-1 w-1/4">
                +1
              </button>
              <button
                @click="amount += 10"
                type="button"
                class="inline-flex items-center justify-center bg-neutral-800 rounded-md text-sm font-medium transition-colors border border-input hover:bg-neutral-700 hover:text-accent-foreground px-2 py-1 w-1/4">
                +10
              </button>
              <button
                @click="amount += 100"
                type="button"
                class="inline-flex items-center justify-center bg-neutral-800 rounded-md text-sm font-medium transition-colors border border-input hover:bg-neutral-700 hover:text-accent-foreground px-2 py-1 w-1/4">
                +100
              </button>
              <button
                @click="amount = item.item.amount"
                type="button"
                class="inline-flex items-center justify-center bg-neutral-800 rounded-md text-sm font-medium transition-colors border border-input hover:bg-neutral-700 hover:text-accent-foreground px-2 py-1 w-1/4">
                ALL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <button
        @click="() => inventory.confirmAmountTransfer(amount)"
        type="button"
        class="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-all">
        Confirm
      </button>

      <button @click="inventory.cancelAmountTransfer" type="button"
        class="rounded px-4 py-2 text-sm font-medium hover:drop-shadow-glow">
        Cancel
      </button>
    </div>
  </div>
</template>
