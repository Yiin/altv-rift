<script setup lang="ts">
import { ref, computed } from "vue";
import { getItemName, isStackable } from "@shared/modules/items";
import { ItemSourceOrigin } from "@shared/interfaces";
import { type TransferingAmount, useInventory } from "@/store/inventory.store";
import { getItemImage } from "@/utils/items";

const props = defineProps<TransferingAmount>();

const inventory = useInventory();
const amount = ref(1);

const itemName = computed(() => getItemName(props.item.item.key));
</script>

<template>
  <div
    class="absolute left-1/2 top-1/2 z-max min-w-64 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-900 p-8 text-white shadow-2xl"
  >
    <div>
      <div>
        <v-img
          class="my-5 flex-grow-0 drop-shadow-md"
          width="10rem"
          :src="getItemImage(item.item.key)"
        />
        <h2 class="text-lg font-bold">
          {{ to && to.origin !== ItemSourceOrigin.Ground ? "You're moving" : "You're dropping" }}
          <br />
          <span class="text-red-500">{{ itemName }}</span>
        </h2>

        <div
          v-if="isStackable(item.item)"
          class="relative mb-6 mt-2 w-full border-y-1 border-neutral-700 pb-3 pt-1"
        >
          <div class="space-y-4">
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="amount"
              >
                Amount
              </label>
              <div class="align-center flex gap-2">
                <input
                  v-model="amount"
                  class="border-input text-md flex h-10 w-28 rounded-md border bg-neutral-700 px-3 py-2 pt-1 font-bold leading-[0] [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Enter amount"
                  type="number"
                />
              </div>
            </div>
            <div class="flex justify-between gap-2">
              <button
                @click="amount += 1"
                type="button"
                class="border-input hover:text-accent-foreground inline-flex w-1/4 items-center justify-center rounded-md border bg-neutral-800 px-2 py-1 text-sm font-medium transition-colors hover:bg-neutral-700"
              >
                +1
              </button>
              <button
                @click="amount += 10"
                type="button"
                class="border-input hover:text-accent-foreground inline-flex w-1/4 items-center justify-center rounded-md border bg-neutral-800 px-2 py-1 text-sm font-medium transition-colors hover:bg-neutral-700"
              >
                +10
              </button>
              <button
                @click="amount += 100"
                type="button"
                class="border-input hover:text-accent-foreground inline-flex w-1/4 items-center justify-center rounded-md border bg-neutral-800 px-2 py-1 text-sm font-medium transition-colors hover:bg-neutral-700"
              >
                +100
              </button>
              <button
                @click="amount = item.item.amount"
                type="button"
                class="border-input hover:text-accent-foreground inline-flex w-1/4 items-center justify-center rounded-md border bg-neutral-800 px-2 py-1 text-sm font-medium transition-colors hover:bg-neutral-700"
              >
                ALL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <button
        @click.stop="() => inventory.confirmAmountTransfer(amount)"
        type="button"
        class="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-600"
      >
        Confirm
      </button>

      <button
        @click="inventory.cancelAmountTransfer"
        type="button"
        class="rounded px-4 py-2 text-sm font-medium hover:drop-shadow-glow"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
